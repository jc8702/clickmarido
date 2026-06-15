# Checklist de Conformidade WCAG 2.1 AA

Este documento serve como guia de revisão de código e QA para garantir que o **ClickMarido** se mantenha acessível.

## 1. Perceptível (Perceivable)
- [ ] **1.1.1 Conteúdo Não-Texto:** Todas as imagens relevantes têm `alt="descrição"`. Imagens decorativas têm `alt=""`.
- [ ] **1.3.1 Informações e Relações:** Uso semântico de HTML (`<main>`, `<nav>`, `<h1>` a `<h6>`). Formulários têm `<label>` atrelado ao `<input>`.
- [ ] **1.4.3 Contraste (Mínimo):** O contraste visual entre texto e fundo é de pelo menos **4.5:1** para textos normais e **3.0:1** para textos grandes.
- [ ] **1.4.11 Contraste Não-Texto:** Ícones e bordas de input têm contraste mínimo de **3:1** contra o fundo.

## 2. Operável (Operable)
- [ ] **2.1.1 Teclado:** Todo o site pode ser operado via teclado (Tab, Enter, Space, Setas).
- [ ] **2.1.2 Sem Armadilhas (No Keyboard Trap):** O foco não fica preso em modais sem chance de sair (Esc fecha modais).
- [ ] **2.2.2 Pausar, Parar, Ocultar:** Carrosséis ou vídeos auto-play podem ser pausados.
- [ ] **2.3.1 Limite de 3 flashes:** Nada pisca mais de 3 vezes por segundo (Risco de convulsão). O sistema respeita a media query `prefers-reduced-motion`.
- [ ] **2.4.1 Ignorar Blocos:** Existe um `<SkipLink />` para pular a navegação do header e ir direto ao `<main id="main-content">`.
- [ ] **2.4.7 Foco Visível:** O `:focus-visible` está nítido e em contraste claro para quem navega por Tab.

## 3. Compreensível (Understandable)
- [ ] **3.2.1 Ao Focar:** O foco em um elemento não engatilha uma mudança drástica de contexto na tela.
- [ ] **3.3.1 Identificação de Erro:** Erros de input (`AccessibleInput`) são narrados claramente ao usuário via `aria-describedby` e `aria-invalid`.

## 4. Robusto (Robust)
- [ ] **4.1.2 Nome, Função, Valor:** Todos os componentes customizados (botões de menu, toggles) reportam sua função correta usando `aria-expanded` ou `aria-pressed`.
