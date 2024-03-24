import { Button } from '@mui/material';

export default function FollowButton({ isFollowing, onClick }) {
  return (
    <Button color={ isFollowing ? 'error' : 'primary' } onClick={ onClick } sx={{ marginTop: 1, marginBottom: 1 }} variant={ isFollowing ? 'outlined': 'contained' }>
      { isFollowing ? 'Unfollow' : 'Follow' }
    </Button>
  );
}
