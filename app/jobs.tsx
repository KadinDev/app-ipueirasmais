import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { Job } from "@/domains/job/Job";
import { useCategories } from "@/domains/category/operations/useCategories";
import { useJobs } from "@/domains/job/operations/useJobs";
import { Box } from "@/ui/components/Box";
import { CategoryChips } from "@/ui/components/CategoryChips";
import { EmptyState } from "@/ui/components/EmptyState";
import { OfflineState } from "@/ui/components/OfflineState";
import { Screen } from "@/ui/components/Screen";
import { ScreenHeader } from "@/ui/components/ScreenHeader";
import { Text } from "@/ui/components/Text";
import { JobCard } from "@/ui/containers/JobCard";
import { formatWhatsAppForDisplay } from "@/ui/utils/format";

const allowedCategorySlugs = new Set([
  "tempo-integral",
  "meio-periodo",
  "servicos",
  "outras",
]);

export default function JobsScreen() {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const {
    data,
    loading,
    refreshing,
    offlineWithoutCache,
    refetch,
    refreshIfStale,
  } = useJobs(categorySlug);
  const { data: categoriesData } = useCategories("job");
  const categories = (categoriesData ?? []).filter((category) =>
    allowedCategorySlugs.has(category.slug),
  );
  const jobs = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt || b.publishedAt || 0).getTime() -
          new Date(a.createdAt || a.publishedAt || 0).getTime(),
      ),
    [data],
  );

  useFocusEffect(
    useCallback(() => {
      refreshIfStale();
    }, [refreshIfStale]),
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 124 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#FF7A00"
            colors={["#FF7A00"]}
          />
        }
      >
        <Box gap="md" marginBottom="lg">
          <ScreenHeader title="Vagas de Emprego" />
          <CategoryChips
            categories={categories}
            selectedSlug={categorySlug}
            onSelect={setCategorySlug}
          />
        </Box>

        {offlineWithoutCache ? (
          <OfflineState onRetry={refetch} />
        ) : loading ? (
          <Box height={220} alignItems="center" justifyContent="center">
            <ActivityIndicator color="#FF7A00" />
          </Box>
        ) : jobs.length === 0 ? (
          <EmptyState
            title={
              categorySlug
                ? "Nenhuma vaga nesta categoria"
                : "Nenhuma vaga disponível"
            }
            description={
              categorySlug
                ? "Selecione outra categoria para conferir oportunidades diferentes."
                : "Novas oportunidades de trabalho aparecerão aqui."
            }
          />
        ) : (
          jobs.map((job) => (
            <Pressable key={job.id} onPress={() => setSelectedJob(job)}>
              <JobCard job={job} />
            </Pressable>
          ))
        )}
      </ScrollView>

      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </Screen>
  );
}

function JobDetailsModal({
  job,
  onClose,
}: {
  job: Job | null;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={!!job}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Box
        flex={1}
        backgroundColor="transparent"
        justifyContent="flex-end"
        style={{ backgroundColor: "rgba(0,0,0,0.62)" }}
      >
        <Box
          backgroundColor="background"
          borderTopLeftRadius="lg"
          borderTopRightRadius="lg"
          padding="lg"
          gap="lg"
          style={{ maxHeight: "86%" }}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="sectionTitle">Detalhe do emprego</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Feather name="x" size={22} color="#FFFFFF" />
            </Pressable>
          </Box>

          {job ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Box gap="lg" paddingBottom="lg">
                <Box
                  backgroundColor="card"
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="border"
                  padding="lg"
                  gap="md"
                >
                  <Box flexDirection="row" gap="md" alignItems="center">
                    <Box
                      width={56}
                      height={56}
                      borderRadius="md"
                      backgroundColor="blue"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Feather name="briefcase" size={24} color="#FFFFFF" />
                    </Box>
                    <Box flex={1}>
                      <Text variant="title" numberOfLines={3}>
                        {job.title}
                      </Text>
                      {job.companyName ? (
                        <Text variant="caption" numberOfLines={1}>
                          {job.companyName}
                        </Text>
                      ) : null}
                    </Box>
                  </Box>

                  {job.locationLabel ? (
                    <InfoLine label="Local" value={job.locationLabel} />
                  ) : null}
                  {job.contractType ? (
                    <InfoLine label="Tipo de vaga" value={job.contractType} />
                  ) : null}
                  {job.salaryLabel ? (
                    <InfoLine label="Salário" value={job.salaryLabel} />
                  ) : null}
                  {job.description ? (
                    <InfoBlock title="Descrição" text={job.description} />
                  ) : null}
                  {job.requirements ? (
                    <InfoBlock title="Requisitos" text={job.requirements} />
                  ) : null}
                  {job.whatsapp ? (
                    <InfoLine
                      label="WhatsApp"
                      value={formatWhatsAppForDisplay(job.whatsapp)}
                    />
                  ) : null}
                  {job.applicationUrl ? (
                    <InfoLine label="Candidatura" value={job.applicationUrl} />
                  ) : null}
                </Box>
              </Box>
            </ScrollView>
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <Box gap="xs">
      <Text variant="badge" color="primary">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </Box>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <Box gap="xs">
      <Text variant="cardTitle">{title}</Text>
      <Text variant="body">{text}</Text>
    </Box>
  );
}
