const createButtons = () => {
  const ROWS_AMOUNT = 3;
  const SEATS_PER_ROW = 8;

  const buttons = [...Array(ROWS_AMOUNT)].map((_, rowIdx) => {
    return [...Array(SEATS_PER_ROW)].map((_, seatIdx) => {
      const realRowNumber = rowIdx + 1;
      const realSeatNumber = seatIdx + 1;

      const element = document.createElement("button");
      element.type = "button";
      element.className = "seats-selector__button";
      element.dataset.row = realRowNumber;
      element.dataset.seat = realSeatNumber;
      element.innerHTML = `<span>${realSeatNumber}</span>`;
      element.title = `Row: ${realRowNumber}, Seat: ${realSeatNumber}`;

      return element;
    });
  });

  return buttons;
};

export const initialize = (container) => {
  const buttons = createButtons();

  if (container) {
    container.innerHTML = "";

    const inner = document.createElement("div");
    inner.className = "seats-selector__inner";

    buttons.forEach((row) => {
      const group = document.createElement("div");
      group.className = "seats-selector__row";

      row.forEach((seat) => group.append(seat));
      inner.append(group);
    });

    container.append(inner);
  }
};
