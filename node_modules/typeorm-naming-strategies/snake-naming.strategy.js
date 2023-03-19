"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnakeNamingStrategy = void 0;
const typeorm_1 = require("typeorm");
const StringUtils_1 = require("typeorm/util/StringUtils");
class SnakeNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(className, customName) {
        return customName ? customName : StringUtils_1.snakeCase(className);
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return (StringUtils_1.snakeCase(embeddedPrefixes.concat('').join('_')) +
            (customName ? customName : StringUtils_1.snakeCase(propertyName)));
    }
    relationName(propertyName) {
        return StringUtils_1.snakeCase(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return StringUtils_1.snakeCase(relationName + '_' + referencedColumnName);
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
        return StringUtils_1.snakeCase(firstTableName +
            '_' +
            firstPropertyName.replace(/\./gi, '_') +
            '_' +
            secondTableName);
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return StringUtils_1.snakeCase(tableName + '_' + (columnName ? columnName : propertyName));
    }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return StringUtils_1.snakeCase(parentTableName + '_' + parentTableIdPropertyName);
    }
    eagerJoinRelationAlias(alias, propertyPath) {
        return alias + '__' + propertyPath.replace('.', '_');
    }
}
exports.SnakeNamingStrategy = SnakeNamingStrategy;
