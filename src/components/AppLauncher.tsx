import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Smartphone, Rocket, History, Trash2 } from "lucide-react";

interface LaunchedApp {
  packageId: string;
  timestamp: Date;
}

const AppLauncher = () => {
  const [packageId, setPackageId] = useState("");
  const [recentApps, setRecentApps] = useState<LaunchedApp[]>([]);

  const launchApp = async () => {
    if (!packageId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid package ID",
        variant: "destructive",
      });
      return;
    }

    try {
      // For mobile devices, we can use intent URLs to launch apps
      const intentUrl = `intent://launch?package=${packageId}#Intent;scheme=launcher;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end`;
      
      // Add to recent apps
      const newApp: LaunchedApp = {
        packageId,
        timestamp: new Date(),
      };
      
      setRecentApps(prev => {
        const filtered = prev.filter(app => app.packageId !== packageId);
        return [newApp, ...filtered].slice(0, 10); // Keep only last 10
      });

      // Try to launch the app
      window.open(intentUrl, '_blank');
      
      toast({
        title: "App Launch Attempted",
        description: `Trying to launch ${packageId}`,
      });
      
      setPackageId("");
    } catch (error) {
      toast({
        title: "Launch Error",
        description: "Failed to launch the app. Make sure the package ID is correct.",
        variant: "destructive",
      });
    }
  };

  const launchRecentApp = (app: LaunchedApp) => {
    setPackageId(app.packageId);
    launchApp();
  };

  const clearHistory = () => {
    setRecentApps([]);
    toast({
      title: "History Cleared",
      description: "Recent apps list has been cleared",
    });
  };


  return (
    <div className="min-h-screen bg-launcher-bg p-4 space-y-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MineLaunch</h1>
          <p className="text-muted-foreground">Launch any Android app by package ID</p>
        </div>

        {/* Main Launch Card */}
        <Card className="mb-6 shadow-[var(--launcher-shadow)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Launch App
            </CardTitle>
            <CardDescription>
              Enter the package ID of the app you want to launch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="e.g., com.example.app"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && launchApp()}
              className="text-lg"
            />
            <Button 
              onClick={launchApp} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Launch App
            </Button>
          </CardContent>
        </Card>


        {/* Recent Apps */}
        {recentApps.length > 0 && (
          <Card className="shadow-[var(--launcher-shadow)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Recent Apps
                  </CardTitle>
                  <CardDescription>Recently launched applications</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentApps.map((app, index) => (
                  <Button
                    key={`${app.packageId}-${index}`}
                    variant="ghost"
                    onClick={() => launchRecentApp(app)}
                    className="w-full justify-between h-auto p-3 hover:bg-accent/10"
                  >
                    <div className="text-left">
                      <div className="font-medium">{app.packageId}</div>
                      <div className="text-xs text-muted-foreground">
                        {app.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <Rocket className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppLauncher;