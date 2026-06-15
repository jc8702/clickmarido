# Guia de Navegação por Teclado e Foco

Garantir navegação 100% por teclado é uma premissa do **ClickMarido**.

## Regras de TabIndex
- NUNCA use `tabindex` maior que `0` (ex: `tabindex="1"` ou `tabindex="2"`). Isso destrói o fluxo natural do DOM.
- Para remover um elemento interativo do fluxo (ex: ao abrir um modal), não use tabindex. Use o atributo `inert` do HTML5 nos elementos de background ou utilize bibliotecas como `focus-trap-react`.
- Para tornar uma `div` interativa fócavel (só em último caso), use `tabindex="0"`, mas garanta que ela tenha listeners de `onKeyDown` mapeando **Enter** e **Space** para simular clique.

## Componentes Interativos

### Botões (`<AccessibleButton>`)
- Devem disparar a ação tanto via `onClick` quanto ao pressionar **Enter** ou **Space** (o `<button>` nativo já faz isso de graça, por isso é preferível não usar divs clicáveis).

### Links
- Devem conter `href`. Tags `<a>` sem `href` não recebem foco naturalmente. Se parece um link mas faz uma ação JS, deveria ser um `<button>`.

### Modais e Drawers
Quando um Modal for aberto:
1. O foco deve ser movido automaticamente para o **primeiro elemento focado** dentro do modal.
2. O fundo da página (atrás do modal) deve ter a propriedade `aria-hidden="true"` ou `inert`.
3. Ao fechar o modal, o foco DEVE retornar para o botão que o originou (ex: botão "Editar Cliente").

## Focus Visible Rings
Nós utilizamos uma regra global no `globals.css` para aplicar o anel de foco APENAS ao navegar por teclado:
```css
*:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```
Isso impede que o contorno feio apareça ao clicar com o mouse, mas garante que usuários de teclado sempre saibam onde estão.
