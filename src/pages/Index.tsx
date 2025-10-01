import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <div className="fixed bottom-8 right-8 z-50">
        <Link to="/b2b">
          <Button size="lg" className="shadow-elegant">
            <Building2 className="h-5 w-5 mr-2" />
            Espace Entreprise
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
