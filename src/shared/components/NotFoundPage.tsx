import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Button } from '@mui/material';

import NextLink from './NextLink';
import { StatusPage } from './StatusPage';

export function NotFoundPage() {
  return (
    <StatusPage
      tone="primary"
      icon={<SearchOffIcon sx={{ fontSize: 48 }} />}
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
    >
      <Button variant="contained" component={NextLink} href="/">
        Back to Dashboard
      </Button>
    </StatusPage>
  );
}
