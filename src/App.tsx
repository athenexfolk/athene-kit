import { Container, Stack, Flex } from './ui/layout';
import { ATKButton } from './ui/button';
import { Icon } from './ui/icon';
import ButtonExamples from './ui/button/button.example';
import LayoutExamples from './ui/layout/layout.example';
import DropdownExamples from './ui/dropdown/dropdown.example';

export default function App() {
  return (
    <>
      <Container
        maxWidth={600}
        p={6}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack gap={6}>
          <Flex align="center" justify="center" gap={2}>
            <Icon name="star" size={40} />
            <h1 style={{ margin: 0, fontSize: 32 }}>Welcome to Athene Kit</h1>
          </Flex>
          <p style={{ textAlign: 'center', fontSize: 18, color: '#444' }}>
            A modern UI kit for building beautiful web apps with React.
          </p>
          <Flex gap={2} justify="center">
            <ATKButton variant="primary" size="lg">
              Get Started
            </ATKButton>
            <ATKButton variant="secondary" size="lg">
              Docs
            </ATKButton>
          </Flex>
        </Stack>
      </Container>
      <Container p={6}>
        <LayoutExamples />
        <ButtonExamples />
        <DropdownExamples />
      </Container>
    </>
  );
}
