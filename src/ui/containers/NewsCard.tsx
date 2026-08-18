import type { NewsPreviewHome } from "@/domains/news/News";
import { Box } from "../components/Box";
import { RemoteImage } from "../components/RemoteImage";
import { Text } from "../components/Text";
import { formatDate } from "../utils/format";

type NewsCardProps = {
  news: NewsPreviewHome;
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Box
      height={92}
      flexDirection="row"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      overflow="hidden"
      borderColor="border"
      borderWidth={1}
    >
      <Box width={104}>
        <RemoteImage uri={news.coverUrl} height={92} radius="none" />
      </Box>
      <Box flex={1} padding="sm" justifyContent="center" gap="xs">
        <Text variant="cardTitle" numberOfLines={2}>
          {news.title}
        </Text>
        {news.excerpt ? (
          <Text variant="caption" numberOfLines={1}>
            {news.excerpt}
          </Text>
        ) : null}
        <Text variant="caption">{formatDate(news.publishedAt)}</Text>
      </Box>
    </Box>
  );
}
