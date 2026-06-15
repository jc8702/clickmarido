# Guia de Testes de Acessibilidade

Testar acessibilidade requer validação automatizada E manual.

## 1. Ferramentas Automatizadas
Nossa pipeline de E2E já integra o **@axe-core/playwright**, que bloqueia PRs caso hajam violações detectáveis pelo Axe (cerca de 30% a 50% dos problemas).
- **Extensão Local**: Recomendamos a instalação da extensão [Axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) no Chrome. Rode-a localmente em cada tela finalizada.
- **Lighthouse**: Rode pela aba "Lighthouse" do Chrome DevTools. **Nossa meta é Score >= 95**.

## 2. Leitores de Tela (Screen Readers)
Teste manual essencial (especialmente para validação dos atributos `aria-` e `AccessibleInput`):

- **Mac (VoiceOver)**: 
  - Ligue via `Cmd + F5`.
  - Use `Ctrl + Option + Setas` para navegar, ou a tecla `Tab`.
- **Windows (NVDA)**:
  - Faça download do [NVDA](https://www.nvaccess.org/).
  - É o padrão ouro de testes para a web. Navegue na aplicação de olhos fechados escutando os *announcements*.

## 3. Simulação de Baixa Visão (DevTools)
No Chrome DevTools:
1. Abra o painel **Rendering** (Menu de 3 pontos > More Tools > Rendering).
2. Em **Emulate vision deficiencies**, teste:
   - **Blurred vision** (Miopia/baixa acuidade visual).
   - **Deuteranopia** ou **Protanopia** (Daltonismo). Garanta que os status de sucesso (verde) e erro (vermelho) não dependam SÓ da cor. Use ícones ou rótulos ("Erro: CPF Inválido").

## 4. Teste de Prefers-Reduced-Motion
No Chrome DevTools:
1. Painel **Rendering**.
2. Em **Emulate CSS media feature prefers-reduced-motion**, selecione `reduce`.
3. Navegue no app e veja se as animações (modais subindo, botões mudando) foram neutralizadas, conforme nosso `globals.css`.
