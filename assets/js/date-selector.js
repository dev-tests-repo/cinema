import { splitDateTime, addLeadingZero } from "./utils.js";

const generateDates = () => {
  const NEXT_DAYS_AMOUNT = 7;

  const dates = [...Array(NEXT_DAYS_AMOUNT)].map((_, idx) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + idx);
    const { fullDate, day, weekDay } = splitDateTime(currentDate);

    return { fullDate, day, weekDay };
  });

  return dates;
};

const createButtons = (dates) => {
  const buttons = dates.map((date) => {
    const { fullDate, day, weekDay } = date;

    const element = document.createElement("button");
    element.type = "button";
    element.className = "date-selector__button";
    element.dataset.fullDate = fullDate;
    element.innerHTML = `<span>${weekDay}</span>
                         <span>${addLeadingZero(day)}</span>`;
    return element;
  });

  return buttons;
};

export const initialize = (container) => {
  const dates = generateDates();

  const buttons = createButtons(dates);

  if (container) {
    buttons.forEach((button) => {
      container.append(button);
    });
  }
};
