"use client";
import React from "react";
import { ConfigProvider } from "antd";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2A2A5A",
            borderRadius: 2,
          },
          components: {
            Button: {
              controlHeight: 45,
              boxShadow: "none",
              colorPrimaryBgHover: "#2A2A5A",
              colorPrimaryHover: "#2A2A5A",
              controlOutline : 'none',
              colorBorder: "#2A2A5A",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
}

export default ThemeProvider;
