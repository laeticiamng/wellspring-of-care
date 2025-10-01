import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Briefcase, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface B2BSwitchProps {
  isManager?: boolean;
}

export function B2BSwitch({ isManager = false }: B2BSwitchProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"user" | "manager">(isManager ? "manager" : "user");

  const handleSwitch = () => {
    const newMode = mode === "user" ? "manager" : "user";
    setMode(newMode);
    
    if (newMode === "manager") {
      toast.success("Mode Manager activé 👔");
      navigate("/app/rh");
    } else {
      toast.success("Mode Utilisateur activé 💚");
      navigate("/app/home");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <AnimatePresence mode="wait">
        {mode === "user" && (
          <motion.div
            key="user-mode"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
              onClick={handleSwitch}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-elegant"
              size="lg"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Passer en mode Manager
            </Button>
          </motion.div>
        )}
        
        {mode === "manager" && (
          <motion.div
            key="manager-mode"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
              onClick={handleSwitch}
              className="bg-gradient-primary shadow-elegant"
              size="lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Revenir au mode Utilisateur
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
