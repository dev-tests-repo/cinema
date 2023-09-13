import { splitDateTime } from "./utils.js";

const generateSessions = () => {
  const FIRST_MOVIE_HOURS = 10;
  const LAST_MOVIE_HOURS = 20;
  const MOVIE_DURATION_MINUTES = 120;

  const sessions = [];

  const firstSessionTime = new Date(new Date(0, 0).setHours(FIRST_MOVIE_HOURS));
  const lastSessionTime = new Date(new Date(0, 0).setHours(LAST_MOVIE_HOURS));

  // Create as many sessions as possible between the time of the first and last session
  let current = firstSessionTime;

  while (current <= lastSessionTime) {
    const startTime = current.toTimeString().slice(0, 5);
    current.setMinutes(current.getMinutes() + MOVIE_DURATION_MINUTES);
    const endTime = current.toTimeString().slice(0, 5);

    sessions.push({ startTime, endTime });
  }

  return sessions;
};

const createButtons = (sessions, selectedValues) => {
  const { date: selectedDate } = selectedValues;
  const { fullDate: currentDate, time: currentTime } = splitDateTime(
    new Date()
  );

  const buttons = sessions.map((time) => {
    const { startTime, endTime } = time;

    // Disable the button if the session has already started
    const isDateEqual = selectedDate === currentDate;
    const isTimePassed = startTime < currentTime;
    const isDisabled = isDateEqual && isTimePassed;

    const element = document.createElement("button");
    element.type = "button";
    element.className = "time-selector__button";
    element.dataset.startTime = startTime;
    element.dataset.endTime = endTime;
    element.innerHTML = startTime;
    element.disabled = isDisabled;

    return element;
  });

  return buttons;
};

export const initialize = (container, selectedValues) => {
  const sessions = generateSessions();

  const buttons = createButtons(sessions, selectedValues);

  if (container) {
    container.innerHTML = "";

    buttons.forEach((button) => {
      container.append(button);
    });
  }
};
