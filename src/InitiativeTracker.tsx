import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import SkipNextRounded from "@mui/icons-material/SkipNextRounded";

import OBR, { isImage, Item, Player } from "@owlbear-rodeo/sdk";

import { statsCharacter } from "./statsCharacter";

import addIcon from "./assets/add.svg";
import removeIcon from "./assets/remove.svg";

import { InitiativeListItem } from "./InitiativeListItem";
import { getPluginId } from "./getPluginId";
import { InitiativeHeader } from "./InitiativeHeader";
import { isPlainObject } from "./isPlainObject";

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is {
  hp: string;
  active: boolean;
  maxHp: string;
  sanity: string;
  maxSanity: string;
  points: string;
} {
  return (
    isPlainObject(metadata) &&
    typeof metadata.hp === "string" &&
    typeof metadata.active === "boolean"
  );
}

export function InitiativeTracker() {
  const [statsCharacter, setStatsCharacter] = useState<statsCharacter[]>([]);
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");

  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  //Inicialista Estado
  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const statsCharacter: statsCharacter[] = [];
      for (const item of items) {
        if (isImage(item)) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            statsCharacter.push({
              id: item.id,
              hp: metadata.hp,
              maxHp: metadata.maxHp,
              sanity: metadata.sanity,
              maxSanity: metadata.maxSanity,
              points: metadata.points,
              name: item.text.plainText || item.name,
              active: metadata.active,
              visible: item.visible,
            });
          }
        }
      }
      setStatsCharacter(statsCharacter);
    };

    OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, []);

  //Adiciona no medo do OWL a opção para adicionar ao menu da ordem
  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: addIcon,
          label: "Adicionar ao Menu da Ordem",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: removeIcon,
          label: "Remover do Menu da Ordem",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
            ],
            permissions: ["UPDATE"],
          },
        },
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items, (items) => {
          // Check whether to add the items to initiative or remove them
          const addToInitiative = items.every(
            (item) => item.metadata[getPluginId("metadata")] === undefined
          );
          let count = 0;
          for (let item of items) {
            if (addToInitiative) {
              item.metadata[getPluginId("metadata")] = {
                hp: `0`,
                maxHp: `0`,
                sanity: `0`,
                maxSanity: `0`,
                points: `0`,
                active: false,
              };
              count += 1;
            } else {
              delete item.metadata[getPluginId("metadata")];
            }
          }
        });
      },
    });
  }, []);

  function handleHpChange(id: string, newHp: string) {
    // Set local items immediately
    setStatsCharacter((prev) =>
      prev.map((stats) => {
        if (stats.id === id) {
          return {
            ...stats,
            hp: newHp,
          };
        } else {
          return stats;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.hp = newHp;
        }
      }
    });
  }

  function handleMaxHpChange(id: string, newMaxHp: string) {
    // Set local items immediately
    setStatsCharacter((prev) =>
      prev.map((stats) => {
        if (stats.id === id) {
          return {
            ...stats,
            maxHp: newMaxHp,
          };
        } else {
          return stats;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.maxHp = newMaxHp;
        }
      }
    });
  }

  function handleSanityChange(id: string, newSanity: string) {
    // Set local items immediately
    setStatsCharacter((prev) =>
      prev.map((stats) => {
        if (stats.id === id) {
          return {
            ...stats,
            sanity: newSanity,
          };
        } else {
          return stats;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.sanity = newSanity;
        }
      }
    });
  }

  function handleMaxSanityChange(id: string, newMaxSanity: string) {
    // Set local items immediately
    setStatsCharacter((prev) =>
      prev.map((stats) => {
        if (stats.id === id) {
          return {
            ...stats,
            maxSanity: newMaxSanity,
          };
        } else {
          return stats;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.maxSanity = newMaxSanity;
        }
      }
    });
  }

  function handlePointsChange(id: string, newPoints: string) {
    // Set local items immediately
    setStatsCharacter((prev) =>
      prev.map((stats) => {
        if (stats.id === id) {
          return {
            ...stats,
            points: newPoints,
          };
        } else {
          return stats;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (isMetadata(metadata)) {
          metadata.points = newPoints;
        }
      }
    });
  }

  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (listRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const listHeight = Math.max(borderHeight, 64);
          // Set the action height to the list height + the card header height + the divider
          OBR.action.setHeight(listHeight + 64 + 1);
        }
      });
      resizeObserver.observe(listRef.current);
      return () => {
        resizeObserver.disconnect();
        // Reset height when unmounted
        OBR.action.setHeight(129);
      };
    }
  }, []);

  return (
    <>
      <img className="fundo" src="./public/teste.png" />
      <Stack height="100vh">
        <InitiativeHeader
          subtitle={statsCharacter.length === 0 ? "" : undefined}
        />
        <Box sx={{ overflowY: "auto" }}>
          <List ref={listRef}>
            {statsCharacter.map((stats) => (
              <InitiativeListItem
                key={stats.id}
                statsCharacter={stats}
                onHpChange={(newCount) => {
                  handleHpChange(stats.id, newCount);
                }}
                onMaxHpChange={(newCount) => {
                  handleMaxHpChange(stats.id, newCount);
                }}
                onSanityChange={(newCount) => {
                  handleSanityChange(stats.id, newCount);
                }}
                onMaxSanityChange={(newCount) => {
                  handleMaxSanityChange(stats.id, newCount);
                }}
                onPointsChange={(newCount) => {
                  handlePointsChange(stats.id, newCount);
                }}
                showHidden={role === "GM"}
              />
            ))}
          </List>
        </Box>
      </Stack>
    </>
  );
}
