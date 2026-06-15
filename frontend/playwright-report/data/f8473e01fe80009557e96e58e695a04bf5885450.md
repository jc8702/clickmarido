# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: clientes.spec.ts >> Clientes CRUD Flow >> should validate required fields in create client
- Location: e2e\clientes.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Pular para o conteúdo principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: CM
      - generic [ref=e10]:
        - heading "Acesse o ERP + CRM" [level=3] [ref=e11]
        - paragraph [ref=e12]: Insira suas credenciais para entrar no Click Marido
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - text: E-mail institucional
          - generic [ref=e16]:
            - img [ref=e17]
            - textbox "E-mail institucional" [ref=e20]:
              - /placeholder: nome@clickmarido.com.br
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: Senha de acesso
            - link "Esqueceu a senha?" [ref=e24] [cursor=pointer]:
              - /url: /esqueci-senha
          - generic [ref=e25]:
            - img [ref=e26]
            - textbox "Senha de acesso" [ref=e29]:
              - /placeholder: ••••••••
        - button "Entrar no Painel" [ref=e30]:
          - generic [ref=e31]: Entrar no Painel
          - img [ref=e32]
      - generic [ref=e34]:
        - paragraph [ref=e35]: "Usuários de demonstração (Senha: senha123):"
        - generic [ref=e36]:
          - generic [ref=e37]: 🔑 admin@clickmarido.com.br
          - generic [ref=e38]: 🔧 tecnico@clickmarido.com.br
          - generic [ref=e39]: 📞 atendente@clickmarido.com.br
          - generic [ref=e40]: 💼 gestor@clickmarido.com.br
  - button "Open Next.js Dev Tools" [ref=e46] [cursor=pointer]:
    - img [ref=e47]
  - alert [ref=e50]
```