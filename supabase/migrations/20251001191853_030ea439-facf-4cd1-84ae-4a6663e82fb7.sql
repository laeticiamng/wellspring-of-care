-- Supprimer et recréer la fonction accept_invitation
DROP FUNCTION IF EXISTS public.accept_invitation(text);

CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  invitation_record RECORD;
  result jsonb;
BEGIN
  -- Vérifier que l'invitation existe et est valide
  SELECT * INTO invitation_record
  FROM public.invitations
  WHERE token = invitation_token
    AND status = 'pending'
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invitation invalide ou expirée'
    );
  END IF;
  
  -- Vérifier que l'utilisateur correspond à l'email de l'invitation
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND email = invitation_record.email
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cette invitation n''est pas pour votre compte'
    );
  END IF;
  
  -- Mettre à jour le profil de l'utilisateur
  UPDATE public.profiles
  SET 
    org_id = invitation_record.org_id,
    team_id = invitation_record.team_id,
    role = invitation_record.role::text
  WHERE id = auth.uid();
  
  -- Marquer l'invitation comme acceptée
  UPDATE public.invitations
  SET 
    status = 'accepted',
    accepted_at = now()
  WHERE token = invitation_token;
  
  result := jsonb_build_object(
    'success', true,
    'org_id', invitation_record.org_id,
    'team_id', invitation_record.team_id,
    'role', invitation_record.role
  );
  
  RETURN result;
END;
$$;

-- Corriger get_user_subscription
DROP FUNCTION IF EXISTS public.get_user_subscription(uuid);

CREATE OR REPLACE FUNCTION public.get_user_subscription(user_uuid uuid)
RETURNS TABLE(plan_name text, monthly_quota integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(s.plan_type, 'free')::text as plan_name,
    CASE 
      WHEN s.plan_type = 'premium' THEN 50
      WHEN s.plan_type = 'pro' THEN 100
      ELSE 10
    END as monthly_quota
  FROM public.profiles p
  LEFT JOIN public.subscriptions s ON s.user_id = p.id
  WHERE p.id = user_uuid;
END;
$$;