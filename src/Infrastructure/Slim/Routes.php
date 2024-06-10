<?php

namespace EneraTechTest\Infrastructure\Slim;

use EneraTechTest\Adapters\API\GetBooks\Controller as APIGetBooksController;

use EneraTechTest\Adapters\API\DeleteBook\Controller as APIDeleteController;
use EneraTechTest\Adapters\API\PostBook\Controller as Controller;


class Routes
{
    public static function addAPIRoutes($app): void
    {
        $app->get('/api/books', APIGetBooksController::class);
        $app->post('/api/books', Controller::class);
        $app->get('/api/books/{bookID}', APIGetBooksController::class);   
        $app->get('/', function ($request, $response) {                   
            $html = file_get_contents(dirname(__DIR__, 3). '/public/books.html');            
            $response->getBody()->write($html);                                         
            return $response;
        });     
        $app->get('/{file:.*}', function ($request, $response) {                   
            $html = file_get_contents(dirname(__DIR__, 3). '/public/404.html');            
            $response->getBody()->write($html);                                         
            return $response;
        });         
       $app->get('/js/{file:.*}', function ($request, $response, $args) {            
            $filePath = dirname(__DIR__, 3). '/public/js/' . $args['file'];
            if (file_exists($filePath)) {
                return $response->withHeader('Content-Type', 'application/javascript')
                                ->write(file_get_contents($filePath));
            } else {
                return $response->withStatus(404, 'Fichier non trouvé');
            }
        });            
        $app->patch('/api/books/{bookID}', function ($request, $response) {
            $bookId = $request->getAttribute('bookID');
            $data = $request->getParsedBody();

            if (isset($data['book']['title']) && isset($data['book']['releaseDate'])) {
                $newTitle = $data['book']['title'];
                $newReleaseDate = $data['book']['releaseDate'];

                $json = file_get_contents(dirname(__DIR__, 1) . '/Database/Data/EneraTechTest_Core_Entities_Book.json');
                $books = json_decode($json, true);
                $updatedBooks = array_map(function ($book) use ($bookId, $newTitle, $newReleaseDate) {
                    if ($book['id'] == $bookId) {
                        $book['releaseDate'] = $newReleaseDate;
                        $book['title'] = $newTitle;
                    }
                    return $book;
                }, $books);

                file_put_contents(dirname(__DIR__, 1) . '/Database/Data/EneraTechTest_Core_Entities_Book.json', json_encode($updatedBooks));
                $response->getBody()->write(json_encode(['message' => "Livre avec l'ID $bookId mis à jour avec le titre : $newTitle, la date de sortie : $newReleaseDate"]));
                
                return $response->withHeader('Content-Type', 'application/json');
            } else {
                return $response->withStatus(400)->withJson(['error' => 'Champ "book.title" ou "book.releaseDate" manquant dans la requête']);
            }
        });   
        $app->delete('/api/books/{bookID}', APIDeleteController::class);   
    }
}