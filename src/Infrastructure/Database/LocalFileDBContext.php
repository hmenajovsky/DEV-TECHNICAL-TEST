<?php

namespace EneraTechTest\Infrastructure\Database;

use ReflectionClass;

use EneraTechTest\Core\Entities\BaseEntity;
use EneraTechTest\Infrastructure\DataAccess\DBContext;

class LocalFileDBContext implements DBContext
{
    private string $storagePath = __DIR__ . '/Data';
    private array $data = [];

    public function __construct()
    {
        $this->loadData();
    }

    private function loadData(): void
    {
        $this->data = [];

        foreach (glob($this->storagePath . '/*.json') as $file) {

            $fileName = basename($file, '.json');
            $fullClassName = str_replace('_', '\\', $fileName);

            $jsonData = file_get_contents($file);
            $entitiesArray = json_decode($jsonData, true);

            $entities = [];
            foreach ($entitiesArray as $entityId => $entityData) {
                $entities[$entityId] = $this->jsonDeserialize($entityData, $fullClassName);
            }

            $this->data[$fullClassName] = $entities;
        }
    }

    public function flush(): void
    {
        foreach ($this->data as $fullClassName => $entities) {

            $fileName = str_replace('\\', '_', $fullClassName) . '.json';
            $filePath = $this->storagePath . '/' . $fileName;

            $jsonData = json_encode($entities);
            file_put_contents($filePath, $jsonData);
        }
    }

    private function jsonDeserialize(array $data, string $className): object
    {
        $reflector = new ReflectionClass($className);

        $object = $reflector->newInstanceWithoutConstructor();

        foreach ($data as $key => $value) {
            if ($reflector->hasProperty($key)) {
                $property = $reflector->getProperty($key);
                $property->setAccessible(true);
                $property->setValue($object, $value);
            }
        }

        return $object;
    }

    public function persist(BaseEntity $entity): void
    {
        $fullClassName = get_class($entity);

        if (!isset($this->data[$fullClassName])) {
            $this->data[$fullClassName] = [];
        }

        $reflectionClass = new ReflectionClass($entity);

        $idProperty = $reflectionClass->getProperty('id');
        $idProperty->setAccessible(true);

        if (!$idProperty->getValue($entity)) {
            $idProperty->setValue($entity, $this->generateUniqueISBN());
        }

        $this->data[$fullClassName][$idProperty->getValue($entity)] = $entity;
    }

    public function listAll(string $entityClassName): array
    {

        if (!isset($this->data[$entityClassName])) {
            return [];
        }

        return array_values($this->data[$entityClassName]);
    }

    public function findByID(string $entityName, string $id): ?BaseEntity
    {
        return $this->data[$entityName][$id] ?? null;
    }

    private function generateUniqueISBN(): string
    {
        static $generatedISBNs = [];
        do {
            $isbn = $this->generateRandomISBN();
        } while (in_array($isbn, $generatedISBNs));

        $generatedISBNs[] = $isbn;

        return $isbn;
    }


    private function generateRandomISBN(): string
    {
        $isbn = '978';

        for ($i = 0; $i < 9; $i++) {
            if ($i == 0 || $i == 4 || $i == 8) {
                $isbn .= '-';
            }
            $isbn .= mt_rand(0, 9);
        }

        $isbn .= $this->calculateISBNCheckDigit($isbn);
        $isbn = substr_replace($isbn, '-', 12, 0);

        return $isbn;
    }

    private function calculateISBNCheckDigit($isbn): string
    {
        $sum = 0;
        $multiplier = 1;
        for ($i = 0; $i < strlen($isbn); $i++) {
            if ($isbn[$i] == '-')
                continue;
            $sum += $multiplier * (int) $isbn[$i];
            $multiplier = $multiplier == 1 ? 3 : 1;
        }
        $checkDigit = 10 - ($sum % 10);
        if ($checkDigit == 10) {
            $checkDigit = 0;
        }
        return $checkDigit;
    }
}
