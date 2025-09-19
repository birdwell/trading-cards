import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandTabsProps {
  children: React.ReactNode;
  defaultTab?: "basketball" | "football";
}

export default function BrandTabs({ children, defaultTab = "basketball" }: BrandTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        <TabsTrigger value="basketball" className="gap-2">
          <span>🏀</span>
          Basketball
        </TabsTrigger>
        <TabsTrigger value="football" className="gap-2">
          <span>🏈</span>
          Football
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basketball" className="mt-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.props as any).sport === "basketball") {
            return child;
          }
          return null;
        })}
      </TabsContent>

      <TabsContent value="football" className="mt-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.props as any).sport === "football") {
            return child;
          }
          return null;
        })}
      </TabsContent>
    </Tabs>
  );
}
