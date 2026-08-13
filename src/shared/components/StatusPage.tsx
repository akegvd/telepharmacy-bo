'use client';

import { Box, Container, Stack, styled, Typography } from '@mui/material';

type TStatusPageTone = 'primary' | 'error';

interface IStatusPageProps {
  icon: React.ReactNode;
  tone?: TStatusPageTone;
  code?: string;
  title: string;
  description: string;
  detail?: string;
  children?: React.ReactNode;
}

interface IToneProps {
  tone: TStatusPageTone;
}

const Root = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh',
  [theme.breakpoints.up('sm')]: {
    minHeight: '75vh',
  },
}));

const Content = styled(Stack)({
  alignItems: 'center',
  textAlign: 'center',
}) as typeof Stack;

const IconBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<IToneProps>(({ theme, tone }) => ({
  width: 96,
  height: 96,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette[tone].lighter,
  color: theme.palette[tone].main,
}));

const StatusCode = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<IToneProps>(({ theme, tone }) => ({
  fontWeight: 800,
  fontSize: 72,
  lineHeight: 1,
  letterSpacing: -2,
  color: theme.palette[tone].main,
  [theme.breakpoints.up('sm')]: {
    fontSize: 96,
  },
}));

const Actions = styled(Stack)({
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const StatusPage = ({
  icon,
  tone = 'primary',
  code,
  title,
  description,
  detail,
  children,
}: IStatusPageProps) => {
  const titleId = 'status-page-title';

  return (
    <Root maxWidth="sm" sx={{ py: 4 }}>
      <Content component="section" aria-labelledby={titleId} spacing={2}>
        <IconBadge tone={tone}>{icon}</IconBadge>

        {code ? (
          <StatusCode variant="h1" tone={tone}>
            {code}
          </StatusCode>
        ) : null}

        <Box>
          <Typography id={titleId} variant="h4" component="h1">
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
          <Actions direction="row" spacing={1.5} sx={{ pt: 1 }}>
            {children}
          </Actions>
        ) : null}
      </Content>
    </Root>
  );
};
