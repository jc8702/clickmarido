"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const path = __importStar(require("path"));
const project = new ts_morph_1.Project({
    tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
});
const sourceFiles = project.getSourceFiles('src/modules/**/*.ts');
function ensureImport(file, moduleName, namedImports) {
    const imports = file.getImportDeclarations();
    const existingImport = imports.find((i) => i.getModuleSpecifierValue() === moduleName);
    if (existingImport) {
        const existingNamedImports = existingImport.getNamedImports().map((ni) => ni.getName());
        const importsToAdd = namedImports.filter(ni => !existingNamedImports.includes(ni));
        if (importsToAdd.length > 0) {
            existingImport.addNamedImports(importsToAdd);
        }
    }
    else {
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
                        if (type.includes('number'))
                            example = '1';
                        if (type.includes('boolean'))
                            example = 'true';
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
                        if (method.getName() === 'findAll')
                            summary = `Listar todos ${moduleName}`;
                        if (method.getName() === 'findOne')
                            summary = `Buscar um ${moduleName}`;
                        if (method.getName() === 'create')
                            summary = `Criar ${moduleName}`;
                        if (method.getName() === 'update')
                            summary = `Atualizar ${moduleName}`;
                        if (method.getName() === 'remove')
                            summary = `Remover ${moduleName}`;
                        method.addDecorator({
                            name: 'ApiOperation',
                            arguments: [`{ summary: '${summary}' }`]
                        });
                    }
                    if (isPost && !method.getDecorator('ApiCreatedResponse')) {
                        method.addDecorator({ name: 'ApiCreatedResponse', arguments: [`{ description: '${moduleName} criado com sucesso.' }`] });
                    }
                    else if (!isPost && !method.getDecorator('ApiOkResponse')) {
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
//# sourceMappingURL=add-swagger.js.map