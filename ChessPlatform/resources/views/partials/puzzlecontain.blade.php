<div class = "puzzle-main-container">

    <div class="text-heading">All Puzzles</div>

    @forelse($allPuzzlePositions as $eachPuzzle)

    <div class="puzzle-list">

        <div class="fenPos"></div>

        @if($eachPuzzle['category'] == 'checkmate')
        <div class="puzzleDetails">
            <h2>Checkmate in {{ $eachPuzzle['numberOfMoves'] }}</h2>
        </div>
        @endif

        <div class="Status">
            @if($eachPuzzle['completed'] == true)
            <a href="#" class="completed"><i class="fas fa-check-circle"></i> Completed</a>
            @endif

            @if($eachPuzzle['completed'] == false)
            <a href="#" class="uncompleted"><i class="fas fa-times-circle"></i> Uncompleted</a>
            @endif
        </div>

        <div class="play-btn">
            <a href="/play/puzzles/{{ $eachPuzzle['id'] }}"><i class="fas fa-play"></i> Play</a>
        </div>
    </div>

    @empty
        <h2>No Puzzles Inserted</h2>
    @endforelse
</div>