import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Paper, Stack, styled, Typography } from '@mui/material';

import { mapDisplayStatusColorByStatus } from '../constants/mapDisplayStatusColorByStatus';
import { mapDisplayTaskStatusLabelByStatus } from '../constants/mapDisplayTaskStatusLabelByStatus';
import { taskStatusOptionList } from '../constants/taskStatusOptionList';
import { TStatusColor } from '../types/taskStatus';
import { ITaskListSummary } from '../types/utils/transforms/transformTaskListResponse';

interface ISummaryBarProps {
  summary: ITaskListSummary;
}

interface ISummaryStatProps {
  value: number;
  label: string;
  color?: TStatusColor;
}

interface IStatusDotProps {
  tone: TStatusColor;
}

const Root = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'flex-start',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SummaryPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const MetricsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: theme.spacing(1.5),
  rowGap: theme.spacing(1.25),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(4, auto)',
    columnGap: 0,
    rowGap: 0,
    '& > *:not(:last-child)': {
      borderRight: '1px solid',
      borderColor: theme.palette.divider,
      paddingRight: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
}));

const Stat = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    alignItems: 'flex-start',
  },
}));

const StatLabelRow = styled(Stack)({
  alignItems: 'center',
  minWidth: 0,
});

const StatusDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<IStatusDotProps>(({ theme, tone }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette[tone].main,
  flexShrink: 0,
}));

const FlaggedRemark = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.warning.dark,
  backgroundColor: theme.palette.warning.lighter,
  borderRadius: theme.shape.borderRadius,
}));

const FlaggedIcon = styled(WarningAmberIcon)({
  fontSize: 14,
});

const SummaryStat = ({ value, label, color }: ISummaryStatProps) => {
  return (
    <Stat spacing={0.25}>
      <Typography variant="body2" component="span">
        {value}
      </Typography>
      <StatLabelRow direction="row" spacing={0.5}>
        {color && <StatusDot aria-hidden tone={color} />}
        <Typography variant="caption" color="text.secondary" noWrap>
          {label}
        </Typography>
      </StatLabelRow>
    </Stat>
  );
};

export const SummaryBar = ({ summary }: ISummaryBarProps) => {
  return (
    <Root spacing={0.5}>
      {summary.flaggedCount > 0 && (
        <FlaggedRemark direction="row" spacing={0.5} sx={{ px: 0.75, py: 0.25 }}>
          <FlaggedIcon />
          <Typography variant="caption">{summary.flaggedCount} Flagged</Typography>
        </FlaggedRemark>
      )}
      <SummaryPaper
        variant="outlined"
        sx={{
          px: { xs: 1.5, sm: 1.75 },
          py: { xs: 1, sm: 0.75 },
        }}
      >
        <MetricsGrid>
          <SummaryStat value={summary.total} label="Total" />
          {taskStatusOptionList.map((status) => (
            <SummaryStat
              key={status}
              value={summary.statusCounts[status]}
              label={mapDisplayTaskStatusLabelByStatus[status]}
              color={mapDisplayStatusColorByStatus[status]}
            />
          ))}
        </MetricsGrid>
      </SummaryPaper>
    </Root>
  );
};
