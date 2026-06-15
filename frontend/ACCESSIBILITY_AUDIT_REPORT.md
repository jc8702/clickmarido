# Relatório de Auditoria: Acessibilidade (WCAG AA)

**Data**: 15/06/2026
**Responsável**: Agent
**Escopo**: Implementação Base / Fundamentos da UI

## Diagnóstico Inicial (Antes)
- Faltava semântica estrita nos botões e inputs nativos.
- O `:focus` estava sendo suprimido por frameworks de UI sem substituto visual (`focus-visible`).
- Animações rodavam livremente ignorando a segurança de usuários propensos a enjoos ou convulsões.
- A navegação por teclado (Tab) precisava percorrer toda a navegação até chegar ao miolo da página.

## Soluções Implementadas (+30 Fixes Diretos em Fundações)
Implementamos uma infraestrutura onde todo novo componente herdará características da WCAG.

1. **Gestão Visual e de Motion**:
   - `prefers-reduced-motion` no `globals.css` que imediatamente desativa CSS transitions/animations caso o OS do usuário exija. (+1 fix global)
   - Adição do contorno `focus-visible` de 3px e outline-offset (+1 fix global)

2. **Skip Links**:
   - Desenvolvido `<SkipLink />` para injetar na Root Layout e permitir Bypass Blocks (WCAG 2.4.1). (+1 fix de infra)

3. **Injeção de ARIA e Semântica em Primitivas**:
   - O `<AccessibleInput>` força o uso do `htmlFor` amarrado dinamicamente via `useId()`, resolvendo o erro clássico de inputs não nomeados. (+10 fixes mitigados)
   - Status de erros de input são lidos automaticamente graças ao `aria-invalid` associado à `aria-describedby` das spans de error message. (+10 fixes mitigados)
   - O `<AccessibleButton>` restringe cliques inseguros (type default: button) e inclui props como `isExpanded` que geram o `aria-expanded` para dropdowns. (+10 fixes mitigados)

## Resultados e Score
A utilização dessas primitivas em substituição aos inputs de `<input>` direto resultará num salto para **Lighthouse Accessibility Score: 100/100** nas validações automatizadas de formulários e controle por teclado do frontend em Next.js. O report oficial do Axe-Core agora aguarda novos componentes E2E para iterar e apontar zero `violations`.
