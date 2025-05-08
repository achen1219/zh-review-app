
const schedule = {
  "2025-04-20": ["極", "障", "築", "顯"],
  "2025-04-21": ["漠", "綿", "極", "障"]
};

const selector = document.getElementById("date-selector");
const flashcardDiv = document.getElementById("flashcards");

Object.keys(schedule).forEach(date => {
  const option = document.createElement("option");
  option.value = date;
  option.textContent = date;
  selector.appendChild(option);
});

selector.addEventListener("change", () => {
  const chars = schedule[selector.value];
  flashcardDiv.innerHTML = "";
  chars.forEach(char => {
    const div = document.createElement("div");
    div.textContent = "生字：" + char;
    div.className = "flashcard";
    flashcardDiv.appendChild(div);
  });
});

function markComplete() {
  alert("已標記今天為完成！");
}
