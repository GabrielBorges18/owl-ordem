import React from "react";

import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export function InitiativeHeader({
  subtitle,
}: {
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <>
      <CardHeader
        title="Equipe"
        titleTypographyProps={{
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "0.4rem",
            color: "text.primary",
            textAlign: "center",
            marginBottom: "0px"
          },
        }}
      />
      <Divider variant="middle" />
      
    </>
  );
}
