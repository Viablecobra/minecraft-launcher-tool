import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Download, CheckCircle, Package, ArrowLeft } from "lucide-react";
import { mods, categories, type Mod } from "@/data/mods";

interface ModsSectionProps {
  onBack: () => void;
}

const ModsSection = ({ onBack }: ModsSectionProps) => {
  const [modList, setModList] = useState(mods);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredMods = selectedCategory === "all" 
    ? modList 
    : modList.filter(mod => mod.category === selectedCategory);

  const toggleModInstallation = (modId: string) => {
    setModList(prev => prev.map(mod => 
      mod.id === modId 
        ? { ...mod, isInstalled: !mod.isInstalled }
        : mod
    ));

    const mod = modList.find(m => m.id === modId);
    if (mod) {
      toast({
        title: mod.isInstalled ? "Mod Uninstalled" : "Mod Installed",
        description: `${mod.name} has been ${mod.isInstalled ? "uninstalled" : "installed"} successfully`,
      });
    }
  };

  const launchMod = (mod: Mod) => {
    const intentUrl = `intent://launch?package=${mod.packageId}#Intent;scheme=launcher;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end`;
    window.open(intentUrl, '_blank');
    
    toast({
      title: "Launching Mod",
      description: `Starting ${mod.name}...`,
    });
  };

  return (
    <div className="min-h-screen bg-launcher-bg p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mods Collection</h1>
            <p className="text-muted-foreground">Enhance your gaming experience</p>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredMods.map((mod) => (
                <Card key={mod.id} className="shadow-[var(--launcher-shadow)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          {mod.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {mod.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={mod.isInstalled ? "default" : "secondary"}
                        className={mod.isInstalled ? "bg-accent" : ""}
                      >
                        {mod.isInstalled ? "Installed" : "Available"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Version: {mod.version}</span>
                      <span>Category: {mod.category}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                      {mod.packageId}
                    </div>

                    <div className="flex gap-2">
                      {mod.isInstalled ? (
                        <>
                          <Button 
                            onClick={() => launchMod(mod)}
                            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          >
                            Launch
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => toggleModInstallation(mod.id)}
                            className="px-3"
                          >
                            Uninstall
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => toggleModInstallation(mod.id)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMods.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No mods found</h3>
                <p className="text-muted-foreground">
                  No mods available in the {selectedCategory} category.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Card */}
        <Card className="shadow-[var(--launcher-shadow)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Installation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {modList.filter(mod => mod.isInstalled).length}
                </div>
                <div className="text-sm text-muted-foreground">Installed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {modList.filter(mod => !mod.isInstalled).length}
                </div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModsSection;