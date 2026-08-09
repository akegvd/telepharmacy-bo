"use client";

import { Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { TaskCard } from "./TaskCard";
import { NormalizedTask } from "../types/task";

const ROW_HEIGHT = 172;
const ROW_GAP = 16;

function useColumnCount() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  if (isMdUp) return 3;
  if (isSmUp) return 2;
  return 1;
}

function chunkTasks(tasks: NormalizedTask[], columnCount: number) {
  const rows: NormalizedTask[][] = [];
  for (let i = 0; i < tasks.length; i += columnCount) {
    rows.push(tasks.slice(i, i + columnCount));
  }
  return rows;
}

export function TaskList({ tasks }: { tasks: NormalizedTask[] }) {
  const columnCount = useColumnCount();
  const rows = useMemo(() => chunkTasks(tasks, columnCount), [tasks, columnCount]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerOffset, setContainerOffset] = useState(0);

  useLayoutEffect(() => {
    setContainerOffset(containerRef.current?.offsetTop ?? 0);
  }, [rows.length]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT + ROW_GAP,
    overscan: 3,
    scrollMargin: containerOffset,
  });

  return (
    <Box
      ref={containerRef}
      sx={{ position: "relative", width: "100%", height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => (
        <Box
          key={virtualRow.key}
          data-index={virtualRow.index}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: 2,
            transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          {rows[virtualRow.index].map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
