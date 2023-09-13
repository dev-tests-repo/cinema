const getCookie = (name) => {
  const label = name + "=";
  const cookies = decodeURIComponent(document.cookie).split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];

    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }

    if (cookie.indexOf(label) == 0) {
      return cookie.substring(label.length, cookie.length);
    }
  }
};

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const expires = "expires=" + date.toUTCString();

  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const loadTickets = () => {
  return JSON.parse(getCookie("tickets") || "{}");
};

export const saveTickets = (storedTickets, selectedValues) => {
  const { date, time, seats } = selectedValues;

  if (!date || !time || !seats) return;

  const { startTime } = time;

  // Merge existing tickets with selected ones
  storedTickets[date] = {
    ...storedTickets[date],
    [startTime]: [...(storedTickets[date]?.[startTime] ?? []), ...seats],
  };

  setCookie("tickets", JSON.stringify(storedTickets), 365);
};

export const addLeadingZero = (value) => {
  return (value.toString().length == 1 ? "0" : "") + value.toString();
};

export const splitDateTime = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const fullDate = [day, month, year].join(".");

  const week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekDay = week[date.getDay()];

  const hours = addLeadingZero(date.getHours());
  const minutes = addLeadingZero(date.getMinutes());
  const time = [hours, minutes].join(":");

  return { fullDate, day, weekDay, time };
};

export const disableBookedSeats = (storedTickets, selectedValues) => {
  const { date, time } = selectedValues;

  if (!date || !time) return;

  // Check if there are stored tickets for selected date and time
  if (date in storedTickets) {
    if (time.startTime in storedTickets[date]) {
      const tickets = storedTickets[date][time.startTime];

      // Then disable them
      tickets.forEach(([row, seat]) => {
        const button = document.querySelector(
          `.seats-selector__button[data-row='${row}'][data-seat='${seat}']`
        );
        if (button) {
          button.disabled = true;
        }
      });
    }
  }
};

export const toggleSection = (section, { isVisible }) => {
  if (!section) return;
  section.classList.toggle("hidden", !isVisible);
};

export const highlightSelected = (section, target) => {
  if (!section || !target) return;

  const buttons = section.querySelectorAll("button");
  buttons.forEach((button) => button.classList.remove("selected"));
  target.classList.add("selected");
};
