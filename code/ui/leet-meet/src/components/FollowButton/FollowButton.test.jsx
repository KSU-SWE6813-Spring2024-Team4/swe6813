import { render, screen } from '@testing-library/react';
import FollowButton from './FollowButton';

test('that the follow button renders following state properly', async () => {
  render(<FollowButton isFollowing />);
  expect(await screen.findByText(/Unfollow/)).toBeVisible();
});

test('that the follow button renders not following state properly', async () => {
  render(<FollowButton isFollowing={false} />);
  expect(await screen.findByText(/Follow/)).toBeVisible();
});