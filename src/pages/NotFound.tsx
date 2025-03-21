
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlurCard from "@/components/ui/BlurCard";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 animate-fade-in">
      <BlurCard className="max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <FileWarning className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <div className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </BlurCard>
    </div>
  );
};

export default NotFound;
