<?php

namespace EneraTechTest\Infrastructure\Slim;

use EneraTechTest\Adapters\API\GetBooks\Controller as APIGetBooksController;
use EneraTechTest\Adapters\API\PatchBook\Controller as APIPatchController;
use EneraTechTest\Adapters\API\PostBook\Controller as Controller;

class Routes
{
    public static function addAPIRoutes($app): void
    {
        $app->get('/api/books', APIGetBooksController::class);
        $app->post('/api/books', Controller::class);
        $app->get('/api/books/{bookID}', APIGetBooksController::class);
        $app->get('/', function ($request, $response) {
            $html = file_get_contents(dirname(__DIR__, 3) . '/public/books.html');
            $response->getBody()->write($html);
            return $response;
        });
        $app->get('/js/{file:.*}', function ($request, $response, $args) {
            $filePath = dirname(__DIR__, 3) . '/public/js/' . $args['file'];
            if (file_exists($filePath)) {
                return $response->withHeader('Content-Type', 'application/javascript')
                    ->write(file_get_contents($filePath));
            } else {
                return $response->withStatus(404, 'Fichier non trouvé');
            }
        });
    }
}
