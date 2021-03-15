<?php


namespace App\Service;



use App\Repository\SearchRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class InitializeApi
{
    private $player;
    /**
     * @var EntityManagerInterface
     */
    private $em;
    /**
     * @var SearchRepository
     */
    private $searchRepository;

    /**
     * InitializeApi constructor.
     * @param HttpClientInterface $player
     * @param EntityManagerInterface $em
     * @param SearchRepository $searchRepository
     */
    public function __construct(HttpClientInterface $player, EntityManagerInterface $em, SearchRepository $searchRepository)
    {
        $this->player = $player;
        $this->em = $em;
        $this->searchRepository = $searchRepository;
    }

    /**
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */

    public function allPlayer(): array
    {
        $response = $this->player->request(
            'GET',
            'https://www.balldontlie.io/api/v1/players?per_page=100'
        );
        $data = $response->toArray();
        return $data['data'];
    }

    public function currentSearch(): array
    {
        $allSearch = $this->searchRepository->findAll();
        $data = [];
        if (count($allSearch) >= 1)
        {
            foreach ($allSearch as $item) {
                $response = $this->player->request(
                    'GET',
                    'https://www.balldontlie.io/api/v1/players/'.$item->getIdApi()
                );
                $currentData = $response->toArray();
                $data[] = $currentData;
            }
            return $data;
        }
        else{
            return $data;
        }

    }

    public function playerId($id): array
    {
        $data = [];
        $response = $this->player->request(
            'GET',
            'https://www.balldontlie.io/api/v1/players/'.$id
        );
        $currentData = $response->toArray();
        $data[] = $currentData;

        $res = $this->player->request(
            'GET',
            'https://www.balldontlie.io/api/v1/stats?per_page=100&seasons[]=2019&seasons[]=2018&player_ids[]='.$id
        );
        $dataCurrent = $res->toArray();
        $data[] = $dataCurrent;
        return $data;
    }

}