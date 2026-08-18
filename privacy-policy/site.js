const CONTACT_NUMBER = "5588993723747";

const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
menuButton?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
menu?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }),
);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return null;
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function nullable(value) {
  const clean = String(value ?? "").trim();
  return clean || null;
}

function numberOrNull(value) {
  const clean = String(value ?? "")
    .trim()
    .replace(",", ".");
  if (!clean) return null;
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : null;
}

function localDateToIso(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function formatDateTime(value) {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const datePart = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} às ${timePart}`;
}

function formatCompanyHours(hours) {
  const dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  return hours.map((item) => {
    const day = dayNames[item.day_of_week] || `Dia ${item.day_of_week}`;
    if (item.is_closed) return `${day}: Fechado`;
    if (!item.opens_at && !item.closes_at) return `${day}: Não informado`;
    if (item.opens_at && item.closes_at) {
      return `${day}: ${item.opens_at} às ${item.closes_at}`;
    }
    return `${day}: ${item.opens_at || item.closes_at}`;
  });
}

function formValue(form, name) {
  return form.elements.namedItem(name)?.value ?? "";
}

function companyPayload(form) {
  const contacts = [
    {
      kind: "whatsapp",
      value: cleanPhone(formValue(form, "company_whatsapp")),
    },
    { kind: "phone", value: cleanPhone(formValue(form, "phone")) },
    { kind: "instagram", value: nullable(formValue(form, "instagram")) },
    { kind: "maps", value: nullable(formValue(form, "maps_url")) },
  ].filter((item) => item.value);

  const days = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];
  const hours = days.map((day, index) => {
    const closed = form.elements.namedItem(`${day}_closed`)?.checked ?? false;
    return {
      day_of_week: index,
      opens_at: closed ? null : nullable(formValue(form, `${day}_open`)),
      closes_at: closed ? null : nullable(formValue(form, `${day}_close`)),
      is_closed: closed,
      note: null,
    };
  });

  const name = nullable(formValue(form, "name"));
  return {
    submission_type: "company",
    submission_meta: {
      submitted_at: new Date().toISOString(),
      responsible_name: nullable(formValue(form, "responsible_name")),
      responsible_whatsapp: cleanPhone(formValue(form, "responsible_whatsapp")),
      responsible_email: nullable(formValue(form, "responsible_email")),
      requested_plan: formValue(form, "requested_plan") || "basic",
      maps_url: nullable(formValue(form, "maps_url")),
    },
    company: {
      city_slug: "ipueiras",
      category_name: nullable(formValue(form, "category_name")),
      category_slug: slugify(formValue(form, "category_name")),
      name,
      slug: slugify(name || ""),
      description: nullable(formValue(form, "description")),
      neighborhood: nullable(formValue(form, "neighborhood")),
      address_line: nullable(formValue(form, "address_line")),
      latitude: numberOrNull(formValue(form, "latitude")),
      longitude: numberOrNull(formValue(form, "longitude")),
      placement_type: "basic",
      contacts,
      hours,
    },
  };
}

function eventPayload(form) {
  const title = nullable(formValue(form, "title"));
  const isFree = form.elements.namedItem("is_free")?.checked ?? false;
  const requestedPlan = formValue(form, "requested_plan") || "basic";
  return {
    submission_type: "event",
    submission_meta: {
      submitted_at: new Date().toISOString(),
      responsible_name: nullable(formValue(form, "responsible_name")),
      responsible_whatsapp: cleanPhone(formValue(form, "responsible_whatsapp")),
      responsible_email: nullable(formValue(form, "responsible_email")),
      requested_plan: requestedPlan,
      maps_url: nullable(formValue(form, "maps_url")),
    },
    event: {
      city_slug: "ipueiras",
      category_name: nullable(formValue(form, "category_name")),
      category_slug: slugify(formValue(form, "category_name")),
      title,
      slug: slugify(title || ""),
      description: nullable(formValue(form, "description")),
      venue_name: nullable(formValue(form, "venue_name")),
      address_line: nullable(formValue(form, "address_line")),
      neighborhood: nullable(formValue(form, "neighborhood")),
      latitude: numberOrNull(formValue(form, "latitude")),
      longitude: numberOrNull(formValue(form, "longitude")),
      starts_at: localDateToIso(formValue(form, "starts_at")),
      ends_at: localDateToIso(formValue(form, "ends_at")),
      is_free: isFree,
      price_label: isFree
        ? "Gratuito"
        : nullable(formValue(form, "price_label")),
      ticket_url: nullable(formValue(form, "ticket_url")),
      whatsapp: cleanPhone(formValue(form, "event_whatsapp")),
      placement_type:
        requestedPlan === "event_featured" ? "event_featured" : "basic",
      is_featured: requestedPlan === "event_featured",
      show_add_to_calendar: true,
    },
  };
}

function payloadToText(payload) {
  if (payload.submission_type === "company") {
    const company = payload.company;
    const meta = payload.submission_meta;
    return [
      "SOLICITAÇÃO DE EMPRESA — IPUEIRAS+",
      "",
      `Responsável: ${meta.responsible_name || "Não informado"}`,
      `WhatsApp do responsável: ${meta.responsible_whatsapp || "Não informado"}`,
      `E-mail: ${meta.responsible_email || "Não informado"}`,
      `Plano de interesse: ${meta.requested_plan}`,
      "",
      `Empresa: ${company.name || "Não informado"}`,
      `Categoria: ${company.category_name || "Não informado"}`,
      `Descrição: ${company.description || "Não informado"}`,
      `Endereço: ${company.address_line || "Não informado"}`,
      `Bairro: ${company.neighborhood || "Não informado"}`,
      `Google Maps: ${meta.maps_url || "Não informado — Ipueiras+ localizará"}`,
      `Latitude: ${company.latitude ?? "Não informada — Ipueiras+ localizará"}`,
      `Longitude: ${company.longitude ?? "Não informada — Ipueiras+ localizará"}`,
      `Contatos: ${company.contacts.map((item) => `${item.kind}: ${item.value}`).join(" | ") || "Não informado"}`,
      "",
      "HORÁRIOS DE FUNCIONAMENTO",
      ...formatCompanyHours(company.hours),
      "",
      "Imagens: enviarei a logo e a foto de capa diretamente à equipe pelo WhatsApp.",
    ].join("\n");
  }

  const event = payload.event;
  const meta = payload.submission_meta;
  return [
    "SOLICITAÇÃO DE EVENTO — IPUEIRAS+",
    "",
    `Responsável: ${meta.responsible_name || "Não informado"}`,
    `WhatsApp do responsável: ${meta.responsible_whatsapp || "Não informado"}`,
    `E-mail: ${meta.responsible_email || "Não informado"}`,
    `Plano de interesse: ${meta.requested_plan}`,
    "",
    `Evento: ${event.title || "Não informado"}`,
    `Categoria: ${event.category_name || "Não informado"}`,
    `Descrição: ${event.description || "Não informado"}`,
    `Local: ${event.venue_name || "Não informado"}`,
    `Endereço: ${event.address_line || "Não informado"}`,
    `Bairro: ${event.neighborhood || "Não informado"}`,
    `Google Maps: ${meta.maps_url || "Não informado — Ipueiras+ localizará"}`,
    `Latitude: ${event.latitude ?? "Não informada — Ipueiras+ localizará"}`,
    `Longitude: ${event.longitude ?? "Não informada — Ipueiras+ localizará"}`,
    `Início: ${formatDateTime(event.starts_at)}`,
    `Fim: ${formatDateTime(event.ends_at)}`,
    `Entrada: ${event.price_label || "Não informado"}`,
    `WhatsApp: ${event.whatsapp || "Não informado"}`,
    `Ingressos: ${event.ticket_url || "Não informado"}`,
    "",
    "Imagem: enviarei a divulgação do evento diretamente à equipe pelo WhatsApp.",
  ].join("\n");
}

document.querySelectorAll("[data-submission-form]").forEach((form) => {
  const type = form.dataset.submissionForm;
  const status = form.querySelector("[data-status]");
  const getPayload = () =>
    type === "company" ? companyPayload(form) : eventPayload(form);

  form.addEventListener("submit", (event) => event.preventDefault());

  function validate() {
    if (!form.reportValidity()) {
      status.textContent = "Confira os campos obrigatórios antes de continuar.";
      status.className = "form-status show error";
      return false;
    }
    return true;
  }

  form.querySelector("[data-whatsapp]")?.addEventListener("click", () => {
    if (!validate()) return;
    const text = payloadToText(getPayload());
    status.textContent =
      "WhatsApp aberto com os dados preenchidos. Confira a mensagem, envie e depois encaminhe as imagens para a equipe.";
    status.className = "form-status show";
    window.open(
      `https://wa.me/${CONTACT_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
});
