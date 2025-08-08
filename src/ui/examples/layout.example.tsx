import { Box, Container, Flex, Grid, Stack } from '../layout/primitives';

const SampleBox = ({ o }: { o?: number }) => (
  <Box p={4} radius={4} borderWidth={2}>
    Box {o && o}
  </Box>
);

export default function LayoutExamples() {
  return (
    <>
      <Container>
        <Stack gap={4}>
          <Container p={4}>
            Pure Container
            <SampleBox />
          </Container>
          <Container p={4}>
            Stack - Vertical
            <Stack gap={4}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Stack>
          </Container>
          <Container p={4}>
            Stack - Horizontal
            <Stack gap={4} direction="horizontal">
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Stack>
          </Container>
          <Container p={4}>
            Flex - Column
            <Flex gap={4} direction={'column'}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Flex>
          </Container>
          <Container p={4}>
            Flex - Column Reverse
            <Flex gap={4} direction={'column-reverse'}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Flex>
          </Container>
          <Container p={4}>
            Flex - Row
            <Flex gap={4} direction={'row'}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Flex>
          </Container>
          <Container p={4}>
            Flex - Row Reverse
            <Flex gap={4} direction={'row-reverse'}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Flex>
          </Container>
          <Container p={4}>
            Grid - 4 Items 4 Columns
            <Grid gap={4} columns={4}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
            </Grid>
          </Container>
          <Container p={4}>
            Grid - 8 Items 4 Columns
            <Grid gap={4} columns={4}>
              <SampleBox o={1} />
              <SampleBox o={2} />
              <SampleBox o={3} />
              <SampleBox o={4} />
              <SampleBox o={5} />
              <SampleBox o={6} />
              <SampleBox o={7} />
              <SampleBox o={8} />
            </Grid>
          </Container>
        </Stack>
      </Container>
    </>
  );
}
