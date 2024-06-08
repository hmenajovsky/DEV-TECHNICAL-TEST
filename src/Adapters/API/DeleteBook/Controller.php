<?php

namespace EneraTechTest\Adapters\API\DeleteBook;


use Exception;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;


class Controller
{
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ) {
        return $this->deleteBook($request, $response);
    }

    public function deleteBook(ServerRequestInterface $request, ResponseInterface $response)
    {
        $bookId = $request->getAttribute('bookID');

        if (isset($bookId)) {
            $json = file_get_contents(dirname(__DIR__, 3) . '/Infrastructure/Database/Data/EneraTechTest_Core_Entities_Book.json');
            $books = json_decode($json, true);
            $updatedBooks = array_filter($books, function ($book) use ($bookId) {
                return $book['id'] != $bookId;
            });

            file_put_contents(dirname(__DIR__, 3) . '/Infrastructure/Database/Data/EneraTechTest_Core_Entities_Book.json', json_encode($updatedBooks));

            $response->getBody()->write(json_encode(['message' => "Livre avec l'ID $bookId supprimé"]));

            return $response->withHeader('Content-Type', 'application/json');
            
        } else {
            return $response->withStatus(400)->withJson(['error' => 'Champ "book.title" ou "book.releaseDate" manquant dans la requête']);
        }
    }
}
