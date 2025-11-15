document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizForm');
    const fieldsets = Array.from(form.querySelectorAll('.quiz-question'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressLabel = document.getElementById('quizProgressLabel');
    const resultEl = document.getElementById('result');

    let current = 0;

    function updateUI() {
        fieldsets.forEach((fs, i) => fs.hidden = i !== current);
        prevBtn.disabled = current === 0;
        if (current === fieldsets.length - 1) {
            nextBtn.hidden = true;
            submitBtn.hidden = false;
        } else {
            nextBtn.hidden = false;
            submitBtn.hidden = true;
        }
        progressLabel.textContent = `Pergunta ${current + 1} de ${fieldsets.length}`;
    }

    function hasAnswer(index) {
        return !!fieldsets[index].querySelector('input[type="radio"]:checked');
    }

    function requireAnswerFeedback(index) {
        const fs = fieldsets[index];
        fs.setAttribute('aria-invalid', 'true');
        fs.classList.add('required-flash');
        setTimeout(() => {
            fs.removeAttribute('aria-invalid');
            fs.classList.remove('required-flash');
        }, 700);
        const firstInput = fs.querySelector('input[type="radio"]');
        if (firstInput) firstInput.focus();
    }

    prevBtn.addEventListener('click', () => {
        if (current > 0) {
            current--;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (!hasAnswer(current)) {
            requireAnswerFeedback(current);
            return;
        }
        if (current < fieldsets.length - 1) {
            current++;
            updateUI();
        }
    });

 
    form.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowRight') {
            ev.preventDefault();
            nextBtn.click();
        } else if (ev.key === 'ArrowLeft') {
            ev.preventDefault();
            prevBtn.click();
        }
    });

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
      
        if (!hasAnswer(current)) {
            requireAnswerFeedback(current);
            return;
        }

      
        const answers = {};
        fieldsets.forEach(fs => {
            const q = fs.dataset.qid;
            const checked = fs.querySelector('input[type="radio"]:checked');
            answers[q] = checked ? checked.value : null;
        });


        const correct = { '1': 'a', '2': 'b', '3': 'a', '4': 'a', '5': 'a' };

        let score = 0;
        Object.keys(correct).forEach(k => {
            if (answers[k] === correct[k]) score++;
        });

        resultEl.innerHTML = '';
        const heading = document.createElement('div');
        heading.innerHTML = `<strong>Resultado: ${score} / ${fieldsets.length}</strong>`;
        resultEl.appendChild(heading);

        const details = document.createElement('ul');
        details.style.marginTop = '0.5rem';
        fieldsets.forEach(fs => {
            const q = fs.dataset.qid;
            const li = document.createElement('li');
            const selected = answers[q] || '-';
            const ok = answers[q] === correct[q];
            li.textContent = `Pergunta ${q}: sua resposta "${selected}" — ${ok ? 'Correta' : 'Incorreta'}`;
            details.appendChild(li);
        });
        resultEl.appendChild(details);

        
        form.querySelectorAll('input, button').forEach(el => el.disabled = true);
        resultEl.focus && resultEl.focus();
    });


    updateUI();
});