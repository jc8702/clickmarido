import { Project, SyntaxKind, ClassDeclaration, PropertyDeclaration, MethodDeclaration, Decorator } from 'ts-morph';
import * as path from 'path';

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
});

const sourceFiles = project.getSourceFiles('src/modules/**/*.ts');

function ensureImport(file: any, moduleName: string, namedImports: string[]) {
  const imports = file.getImportDeclarations();
  const existingImport = imports.find((i: any) => i.getModuleSpecifierValue() === moduleName);

  if (existingImport) {
    const existingNamedImports = existingImport.getNamedImports().map((ni: any) => ni.getName());
    const importsToAdd = namedImports.filter(ni => !existingNamedImports.includes(ni));
    if (importsToAdd.length > 0) {
      existingImport.addNamedImports(importsToAdd);
    }
  } else {
    file.addImportDeclaration({
      moduleSpecifier: moduleName,
      namedImports: namedImports,
    });
  }
}

sourceFiles.forEach(file => {
  const fileName = file.getBaseName();
  const classes = file.getClasses();

  if (fileName.endsWith('.dto.ts')) {
    classes.forEach(cls => {
      const properties = cls.getProperties();
      if (properties.length > 0) {
        ensureImport(file, '@nestjs/swagger', ['ApiProperty', 'ApiPropertyOptional']);
        
        properties.forEach(prop => {
          if (!prop.getDecorator('ApiProperty') && !prop.getDecorator('ApiPropertyOptional')) {
            const isOptional = prop.hasQuestionToken();
            const decoratorName = isOptional ? 'ApiPropertyOptional' : 'ApiProperty';
            
            let type = prop.getType().getText();
            let example = `'exemplo'`;
            if (type.includes('number')) example = '1';
            if (type.includes('boolean')) example = 'true';
            
            prop.addDecorator({
              name: decoratorName,
              arguments: [`{ description: 'Campo ${prop.getName()}', example: ${example} }`],
            });
          }
        });
      }
    });
  }

  if (fileName.endsWith('.controller.ts')) {
    classes.forEach(cls => {
      // Determine module name from file name (e.g. clients.controller.ts -> Clients)
      const moduleName = fileName.replace('.controller.ts', '').charAt(0).toUpperCase() + fileName.replace('.controller.ts', '').slice(1);
      
      ensureImport(file, '@nestjs/swagger', [
        'ApiTags', 'ApiOperation', 'ApiOkResponse', 'ApiCreatedResponse', 
        'ApiBadRequestResponse', 'ApiUnauthorizedResponse', 'ApiBearerAuth'
      ]);

      if (!cls.getDecorator('ApiTags')) {
        cls.addDecorator({ name: 'ApiTags', arguments: [`'${moduleName}'`] });
      }
      
      if (!cls.getDecorator('ApiBearerAuth')) {
        cls.addDecorator({ name: 'ApiBearerAuth', arguments: [`'JWT-auth'`] });
      }

      cls.getMethods().forEach(method => {
        const isGet = method.getDecorator('Get');
        const isPost = method.getDecorator('Post');
        const isPut = method.getDecorator('Put');
        const isPatch = method.getDecorator('Patch');
        const isDelete = method.getDecorator('Delete');

        if (isGet || isPost || isPut || isPatch || isDelete) {
          if (!method.getDecorator('ApiOperation')) {
            let summary = `Operation ${method.getName()}`;
            if (method.getName() === 'findAll') summary = `Listar todos ${moduleName}`;
            if (method.getName() === 'findOne') summary = `Buscar um ${moduleName}`;
            if (method.getName() === 'create') summary = `Criar ${moduleName}`;
            if (method.getName() === 'update') summary = `Atualizar ${moduleName}`;
            if (method.getName() === 'remove') summary = `Remover ${moduleName}`;

            method.addDecorator({
              name: 'ApiOperation',
              arguments: [`{ summary: '${summary}' }`]
            });
          }

          if (isPost && !method.getDecorator('ApiCreatedResponse')) {
            method.addDecorator({ name: 'ApiCreatedResponse', arguments: [`{ description: '${moduleName} criado com sucesso.' }`] });
          } else if (!isPost && !method.getDecorator('ApiOkResponse')) {
            method.addDecorator({ name: 'ApiOkResponse', arguments: [`{ description: 'Operação realizada com sucesso.' }`] });
          }

          if (!method.getDecorator('ApiBadRequestResponse')) {
            method.addDecorator({ name: 'ApiBadRequestResponse', arguments: [`{ description: 'Dados inválidos.' }`] });
          }
          if (!method.getDecorator('ApiUnauthorizedResponse')) {
            method.addDecorator({ name: 'ApiUnauthorizedResponse', arguments: [`{ description: 'Não autorizado.' }`] });
          }
        }
      });
    });
  }
});

project.saveSync();
console.log('Swagger decorators added successfully!');
