document.addEventListener("DOMContentLoaded", () => {

    function initCheckbox(checkbox) {
        const id = checkbox.dataset.id;
        if(!id) return;

        if(localStorage.getItem(id) === "checked") checkbox.checked = true;

        checkbox.addEventListener("change", () => {
            if(checkbox.checked) localStorage.setItem(id, "checked");
            else localStorage.removeItem(id);
        });
    }

    function addRemoveButton(li, listId) {
        if(li.querySelector(".remove-task")) return; // avoid duplicate buttons
        const btn = document.createElement("button");
        btn.textContent = "✖";
        btn.className = "remove-task";
        li.appendChild(btn);

        const taskValue = li.querySelector("span") ? li.querySelector("span").textContent : li.textContent;

        btn.addEventListener("click", () => {
            li.remove();
            // Remove from savedItems
            let savedItems = JSON.parse(localStorage.getItem(listId)) || [];
            savedItems = savedItems.filter(item => item !== taskValue);
            localStorage.setItem(listId, JSON.stringify(savedItems));
            localStorage.removeItem(taskValue);
        });
    }

    function setupSection(listId, inputId, buttonId) {
        const list = document.getElementById(listId);
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);

        // Add remove buttons to existing items
        list.querySelectorAll("li").forEach(li => {
            addRemoveButton(li, listId);
            const cb = li.querySelector("input[type='checkbox']");
            if(cb) initCheckbox(cb);
        });

        // Load saved items
        const savedItems = JSON.parse(localStorage.getItem(listId)) || [];
        savedItems.forEach(task => {
            // prevent duplicates
            if(![...list.querySelectorAll("span")].some(span=>span.textContent===task)) {
                const li = document.createElement("li");
                li.innerHTML = `<label><input type="checkbox" data-id="${task}"><span>${task}</span></label>`;
                list.appendChild(li);
                initCheckbox(li.querySelector("input[type='checkbox']"));
                addRemoveButton(li, listId);
            }
        });

        button.addEventListener("click", () => {
            const value = input.value.trim();
            if(!value) return;

            const li = document.createElement("li");
            li.innerHTML = `<label><input type="checkbox" data-id="${value}"><span>${value}</span></label>`;
            list.appendChild(li);

            initCheckbox(li.querySelector("input[type='checkbox']"));
            addRemoveButton(li, listId);

            savedItems.push(value);
            localStorage.setItem(listId, JSON.stringify(savedItems));
            input.value = "";
        });
    }

    setupSection("goals", "new-goal", "add-goal");
    setupSection("homework", "new-homework", "add-homework");

    // Collapse/expand cards
    document.querySelectorAll(".card h2").forEach(header => {
        const content = header.nextElementSibling;
        header.addEventListener("click", () => {
            content.style.display = content.style.display === "none" ? "block" : "none";
        });
    });

    // Dark mode
    document.getElementById("toggle-theme").addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
});
