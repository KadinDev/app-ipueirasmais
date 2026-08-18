export function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
}

export function formatFullDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    weekday: "long",
  }).format(new Date(value));
}

export function formatTime(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRating(rating?: number | null, count?: number | null) {
  if (rating == null) return null;
  return `${rating.toFixed(1)}${count != null ? ` (${count})` : ""}`;
}

export function formatHour(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 5);
}

export function formatWhatsAppFromCompany(value?: string | null) {
  if (!value) return "";

  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, "");

  // Remove o código do país (55), se existir
  const phone = numbers.startsWith("55") ? numbers.slice(2) : numbers;

  // Celular com 11 dígitos
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }

  // Telefone fixo com 10 dígitos
  if (phone.length === 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }

  // Caso não esteja em um formato esperado
  return value;
}

export function formatWhatsAppForDisplay(value?: string | null) {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");
  const phone = numbers.startsWith("55") ? numbers.slice(2) : numbers;

  if (phone.length === 11) {
    return `${phone.slice(0, 2)} ${phone.slice(2, 7)} ${phone.slice(7)}`;
  }

  if (phone.length === 10) {
    return `${phone.slice(0, 2)} ${phone.slice(2, 6)} ${phone.slice(6)}`;
  }

  return phone || value;
}
