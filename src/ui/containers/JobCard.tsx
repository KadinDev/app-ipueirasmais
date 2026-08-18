import Feather from "@expo/vector-icons/Feather";
import type { JobCardPreview } from "@/domains/job/Job";
import { Box } from "../components/Box";
import { Text } from "../components/Text";

type JobCardProps = {
  job: JobCardPreview;
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Box
      flexDirection="row"
      gap="md"
      padding="md"
      marginBottom="sm"
      backgroundColor="card"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
    >
      <Box
        width={48}
        height={48}
        borderRadius="md"
        backgroundColor="blue"
        alignItems="center"
        justifyContent="center"
      >
        <Feather name="briefcase" size={22} color="#FFFFFF" />
      </Box>

      <Box flex={1} gap="xs">
        <Text variant="cardTitle" numberOfLines={1}>
          {job.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {job.companyName || "Empresa não informada"}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {[job.locationLabel, job.contractType].filter(Boolean).join(" - ")}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {job.salaryLabel || "Salário a combinar"}
        </Text>
        <Text
          variant="badge"
          color="primary"
          numberOfLines={1}
          style={{ alignSelf: "flex-end" }}
        >
          Ver mais
        </Text>
      </Box>
    </Box>
  );
}
