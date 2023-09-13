import { initialize as initDateSelector } from "./date-selector.js";
import { initialize as initSeatsSelector } from "./seats-selector.js";
import { initialize as initTimeSelector } from "./time-selector.js";
import {
  highlightSelected,
  loadTickets,
  saveTickets,
  toggleSection,
  disableBookedSeats,
} from "./utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // Initialization
  let storedTickets = loadTickets();

  const selectedValues = {
    date: null,
    time: null,
    seats: [],
  };

  const dateSelector = document.querySelector(".date-selector__container");
  const timeSelector = document.querySelector(".time-selector__container");
  const seatsSelector = document.querySelector(".seats-selector__container");
  const submitSection = document.querySelector(".submit__container");

  initDateSelector(dateSelector);

  // Date handler
  if (dateSelector) {
    dateSelector.addEventListener("click", (event) => {
      const target = event.target;
      const { fullDate } = target.dataset;

      if (!fullDate) return;

      selectedValues.date = fullDate;
      highlightSelected(dateSelector, target);

      // Load next step
      initTimeSelector(timeSelector, selectedValues);
      toggleSection(timeSelector, { isVisible: true });
      toggleSection(seatsSelector, { isVisible: false });
      toggleSection(submitSection, { isVisible: false });
    });
  }

  // Time handler
  if (timeSelector) {
    timeSelector.addEventListener("click", (event) => {
      const target = event.target;
      const { startTime, endTime } = target.dataset;

      if (!startTime || !endTime) return;

      selectedValues.time = {
        startTime,
        endTime,
      };
      selectedValues.seats = [];
      highlightSelected(timeSelector, target);

      // Load next step
      initSeatsSelector(seatsSelector);
      disableBookedSeats(storedTickets, selectedValues);
      toggleSection(seatsSelector, { isVisible: true });
      toggleSection(submitSection, { isVisible: false });
    });
  }

  // Seats handler
  if (seatsSelector) {
    seatsSelector.addEventListener("click", (event) => {
      const target = event.target;
      const { row, seat } = target.dataset;

      if (!row || !seat) return;

      const foundIndex = selectedValues.seats.findIndex(
        ([storedRow, storedSeat]) => storedRow == row && storedSeat == seat
      );
      const isFound = foundIndex > -1;
      if (isFound) {
        // Remove if clicked on already selected seat
        selectedValues.seats.splice(foundIndex, 1);
      } else {
        // Add if target seat is not yet selected
        selectedValues.seats.push([row, seat]);
      }
      target.classList.toggle("selected", !isFound);

      // Load next step
      disableBookedSeats(storedTickets, selectedValues);
      toggleSection(submitSection, { isVisible: true });
    });
  }

  // Submit handler
  if (submitSection) {
    submitSection.addEventListener("click", () => {
      saveTickets(storedTickets, selectedValues);
      selectedValues.seats = [];

      // Load previous step
      disableBookedSeats(storedTickets, selectedValues);
      toggleSection(submitSection, { isVisible: false });
    });
  }
});
