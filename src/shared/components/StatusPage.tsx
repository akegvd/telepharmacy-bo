import { Box, Container, Stack, Typography } from "@mui/material";

type TStatusPageTone = "primary" | "error";

interface IStatusPageProps {
  icon: React.ReactNode;
  tone?: TStatusPageTone;
  code?: string;
  title: string;
  description: string;
  detail?: string;
  children?: React.ReactNode;
}

const TONE_SX = {
  primary: {
    bgcolor: "primary.lighter",
    color: "primary.main",
  },
  error: {
    bgcolor: "error.lighter",
    color: "error.main",
  },
} as const;

export function StatusPage({
  icon,
  tone = "primary",
  code,
  title,
  description,
  detail,
  children,
}: IStatusPageProps) {
  const titleId = "status-page-title";

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: { xs: "70vh", sm: "75vh" },
        py: 4,
      }}
    >
      <Stack
        component="section"
        aria-labelledby={titleId}
        spacing={2}
        sx={{ alignItems: "center", textAlign: "center" }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...TONE_SX[tone],
          }}
        >
          {icon}
        </Box>

        {code ? (
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 72, sm: 96 },
              lineHeight: 1,
              letterSpacing: -2,
              color: `${tone}.main`,
            }}
          >
            {code}
          </Typography>
        ) : null}

        <Box>
          <Typography id={titleId} variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        </Box>

        {detail ? (
          <Typography variant="caption" color="text.disabled">
            {detail}
          </Typography>
        ) : null}

        {children ? (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ pt: 1, flexWrap: "wrap", justifyContent: "center" }}
          >
            {children}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
