import { Button, Paper, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { ATTRIBUTES, SKILLS } from '../util/Constants';
import { getRatingCountsForUser } from '../util/Calculator';

export default function UserPage() {
  const { user, ratings } = useLoaderData();

  const ratingData = useMemo(() => {
    if (!ratings) {
      return {}
    }

    const { skill, attribute } = getRatingCountsForUser(ratings);

    return {
      skill: [{ data: SKILLS.map((SKILL) => skill[SKILL]) }],
      attribute: [{ data: ATTRIBUTES.map((ATTRIBUTE) => attribute[ATTRIBUTE]) }]
    }
  }, [ratings])

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography>{user?.username}</Typography>
        <Button>Follow</Button>
      </Stack>
      <Stack direction="row" sx={{ display: 'flex' }}>
        <Paper elevation={3} sx={{ flexGrow: 2 }}>
          <Typography>Skill Ratings</Typography>
          <BarChart
            series={ratingData.skill}
            height={290}
            xAxis={[{ data: SKILLS, scaleType: 'band' }]}
          />
        </Paper>
        <Paper elevation={3} sx={{ flexGrow: 1 }}>
          <Typography>Attribute Ratings</Typography>
          <BarChart
            layout="horizontal"
            series={ratingData.attribute}
            height={290}
            yAxis={[{ data: ATTRIBUTES, scaleType: 'band' }]}
          />
        </Paper>
      </Stack>
    </Stack>
  );
}