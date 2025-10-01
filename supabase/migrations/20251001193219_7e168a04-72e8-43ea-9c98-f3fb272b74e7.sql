-- Créer des triggers d'audit pour les actions sensibles

-- Fonction pour logger les changements d'invitation
CREATE OR REPLACE FUNCTION log_invitation_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO admin_changelog (
      action_type,
      table_name,
      record_id,
      new_value,
      admin_user_id,
      metadata
    ) VALUES (
      'invitation_created',
      'invitations',
      NEW.id::TEXT,
      to_jsonb(NEW),
      NEW.invited_by,
      jsonb_build_object(
        'email', NEW.email,
        'role', NEW.role,
        'org_id', NEW.org_id
      )
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO admin_changelog (
      action_type,
      table_name,
      record_id,
      old_value,
      new_value,
      metadata
    ) VALUES (
      'invitation_status_changed',
      'invitations',
      NEW.id::TEXT,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      jsonb_build_object('email', NEW.email)
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO admin_changelog (
      action_type,
      table_name,
      record_id,
      old_value,
      metadata
    ) VALUES (
      'invitation_deleted',
      'invitations',
      OLD.id::TEXT,
      to_jsonb(OLD),
      jsonb_build_object('email', OLD.email)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Créer le trigger pour les invitations
DROP TRIGGER IF EXISTS audit_invitations ON invitations;
CREATE TRIGGER audit_invitations
  AFTER INSERT OR UPDATE OR DELETE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION log_invitation_changes();

-- Fonction pour logger les changements de rôle
CREATE OR REPLACE FUNCTION log_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO admin_changelog (
      action_type,
      table_name,
      record_id,
      old_value,
      new_value,
      admin_user_id,
      metadata
    ) VALUES (
      'role_changed',
      'profiles',
      NEW.id::TEXT,
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role),
      auth.uid(),
      jsonb_build_object(
        'user_email', (SELECT email FROM auth.users WHERE id = NEW.id),
        'org_id', NEW.org_id,
        'team_id', NEW.team_id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger pour les changements de rôle
DROP TRIGGER IF EXISTS audit_role_changes ON profiles;
CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_role_changes();

-- Fonction pour auto-nettoyer les invitations expirées
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM invitations
  WHERE status = 'pending'
    AND expires_at < now() - INTERVAL '7 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  INSERT INTO cleanup_history (
    cleanup_type,
    affected_records,
    details
  ) VALUES (
    'expired_invitations',
    deleted_count,
    jsonb_build_object('timestamp', now())
  );
  
  RETURN deleted_count;
END;
$$;

-- Fonction pour limiter le taux de création d'invitations
CREATE OR REPLACE FUNCTION check_invitation_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Compter les invitations créées dans les dernières 10 minutes
  SELECT COUNT(*) INTO recent_count
  FROM invitations
  WHERE invited_by = NEW.invited_by
    AND created_at > now() - INTERVAL '10 minutes';
  
  -- Limiter à 10 invitations par 10 minutes
  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Trop d''invitations envoyées. Veuillez patienter quelques minutes.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger de rate limiting
DROP TRIGGER IF EXISTS rate_limit_invitations ON invitations;
CREATE TRIGGER rate_limit_invitations
  BEFORE INSERT ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION check_invitation_rate_limit();