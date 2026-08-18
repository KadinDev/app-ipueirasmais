import { Link } from 'expo-router';
import { Screen } from '@/ui/components/Screen';
import { Box } from '@/ui/components/Box';
import { Text } from '@/ui/components/Text';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Box flex={1} alignItems="center" justifyContent="center" padding="xl">
        <Text variant="title">Tela não encontrada</Text>
        <Link href="/(tabs)" style={{ marginTop: 16 }}>
          <Text color="primary" fontWeight="800">
            Voltar para Home
          </Text>
        </Link>
      </Box>
    </Screen>
  );
}
