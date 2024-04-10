import { Button } from '@mui/material';

export default function FollowButton({ 
  isFollowing, 
  onClick, 
  ...props 
}) {
  return (
    <Button
      color={ isFollowing ? 'error' : 'primary' }
      onClick={ onClick }
      sx={{ marginTop: 1, marginBottom: 1 }}
      variant={ isFollowing ? 'outlined': 'contained' }
      {...props}
    >
      { isFollowing ? 'Unfollow' : 'Follow' }
    </Button>
  );
}
