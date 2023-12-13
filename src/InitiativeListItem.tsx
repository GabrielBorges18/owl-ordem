import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";
import ListItemIcon from "@mui/material/ListItemIcon";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { statsCharacter } from "./statsCharacter";
import { Divider } from "@mui/material";

type InitiativeListItemProps = {
  statsCharacter: statsCharacter;
  onHpChange: (count: string) => void;
  onMaxHpChange: (count: string) => void;
  onSanityChange: (count: string) => void;
  onMaxSanityChange: (count: string) => void;
  onPointsChange: (count: string) => void;
  showHidden: boolean;
};

export function InitiativeListItem({
  statsCharacter,
  onHpChange,
  onMaxHpChange,
  onSanityChange,
  onMaxSanityChange,
  onPointsChange,
  showHidden,
}: InitiativeListItemProps) {
  if (!statsCharacter.visible && !showHidden) {
    return null;
  }

  return (
    <div key={statsCharacter.id} className="profile">
      <p className="nameCharacter"> {statsCharacter.name} </p>
      Vida:
      <Input
        disableUnderline
        sx={{ width: 50 }}
        inputProps={{
          sx: {
            textAlign: "right",
          },
        }}
        style={{
          height:"20px"
        }}
        value={statsCharacter.hp}
        onChange={(e) => {
          const newCount = e.target.value;
          onHpChange(newCount);
        }}
      />{" "}
      /{" "}
      <Input
        disableUnderline
        sx={{ width: 50 }}
        value={statsCharacter.maxHp}
        onChange={(e) => {
          const newCount = e.target.value;
          onMaxHpChange(newCount);
        }}
      />  
      <div className="healthBar">
        <div className="hp" style=
        {{
          width: (parseFloat(statsCharacter.hp) * 100) / parseFloat(statsCharacter.maxHp) + '%'
        }}
        ></div>
      </div>
      Sanidade:
      <Input
        disableUnderline
        sx={{ width: 50 }}
        inputProps={{
          sx: {
            textAlign: "right",
          },
        }}
        value={statsCharacter.sanity}
        onChange={(e) => {
          const newCount = e.target.value;
          onSanityChange(newCount);
        }}
      />{" "} / {" "}
      <Input
        disableUnderline
        sx={{ width: 50 }}
        value={statsCharacter.maxSanity}
        onChange={(e) => {
          const newCount = e.target.value;
          onMaxSanityChange(newCount);
        }}
      />
     <div className="sanityBar">
        <div className="sanity" style=
        {{
          width: (parseFloat(statsCharacter.sanity) * 100) / parseFloat(statsCharacter.maxSanity) + '%'
        }}
        ></div>
      </div>
      Pontos de Esforço:
      <Input
        disableUnderline
        sx={{ width: 50 }}
        inputProps={{
          sx: {
            textAlign: "right",
          },
        }}
        value={statsCharacter.points}
        onChange={(e) => {
          const newCount = e.target.value;
          onPointsChange(newCount);
        }}
      />

      <Divider variant="middle" />
      {!statsCharacter.visible && showHidden && (
        <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
          <VisibilityOffRounded fontSize="small" />
        </ListItemIcon>
      )}
    </div>
  );
}
