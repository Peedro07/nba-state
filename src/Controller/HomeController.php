<?php

namespace App\Controller;

use App\Repository\SearchRepository;
use App\Service\InitializeApi;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @var InitializeApi
     */
    private $initializeApi;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * HomeController constructor.
     * @param InitializeApi $initializeApi
     * @param EntityManagerInterface $em
     */
    public function __construct(InitializeApi $initializeApi, EntityManagerInterface $em)
    {
        $this->initializeApi = $initializeApi;
        $this->em = $em;
    }

    /**
     * @Route("/", name="home")
     */
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    /**
     * @Route("/search", name="search")
     */
    public function search(SearchRepository $searchRepository, PaginatorInterface $paginator, Request $request): Response
    {
        $dataSearch = $this->initializeApi->currentSearch();
        $dataSend = $paginator->paginate(
            $dataSearch,
            $request->query->getInt('page', 1),
            6
        );

        return $this->render('home/search.html.twig',[
            'dataSearch' => $dataSend
        ]);
    }

    /**
     * @Route("/search/delete", name="search.delete")
     */
    public function searchDelete(SearchRepository $searchRepository, PaginatorInterface $paginator, Request $request): Response
    {
        $dataSearch = $searchRepository->findAll();

        foreach ($dataSearch as $item) {
            $this->em->remove($item);
        }

        $this->em->flush();
        return $this->redirectToRoute('search');
    }

    /**
     * @Route("/player", name="player")
     */
    public function player(SearchRepository $searchRepository, PaginatorInterface $paginator, Request $request): Response
    {
        return $this->render('home/player.html.twig');
    }

    /**
     * @Route("/player/{id}", name="player.search", requirements={"id":"\d+"})
     */
    public function playerId($id): Response
    {
        $data = $this->initializeApi->playerId($id);
        $pts = 0;
        $reb = 0;
        foreach ($data[1]['data'] as $value)
        {
            $pts = $value['pts'] + $pts;
            $reb = $value['reb'] + $reb;
        }
        return $this->render('home/playerId.html.twig', [
            'infoPlayer' => $data[0],
            'pts' => $pts,
            'reb' => $reb
        ]);
    }
}