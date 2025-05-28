
import java.awt.*;
import java.awt.event.*;
import java.nio.channels.Pipe;
import java.util.ArrayList;
import java.util.Random;
import javax.swing.*;

public class FlappyBird extends JPanel implements ActionListener,KeyListener{
    int boardwidth = 360;
    int boardheight = 640;

//    images
    Image backgroundImg;
    Image birdImg;
    Image topPeImg;
    Image bottomPeImg;

    //Bird
    int birdX= boardwidth/8;
    int birdY=boardheight/2;
    int birdWidth=34;
    int birdHeight=24;




    class Bird{
        int x = birdX;
        int y = birdY;
        int width = birdWidth;
        int height = birdHeight;
        Image img;
        Bird(Image img){
            this.img=img;
        }
    }
    //pipe
    int pipeX=boardwidth;
    int pipeY=0;
    int pipeWidth=64;
    int pipeHeight=512;
    class Pipe{
        int x = pipeX;
        int y = pipeY;
        int width=pipeWidth;
        int height=pipeHeight;
        Image img;
        boolean passed= false;

        Pipe(Image img){
            this.img=img;

        }
    }

    //Game Logic
    Bird bird;
    int velocityX =-4;//moves pipes to the left speed
    int velocityY=0;
    int gravity=1;

    ArrayList<Pipe> pipes;
    Random random=new Random();

    Timer gameLoop;
    Timer placePipesTimer;
    boolean gameOver=false;
    double score=0;


    FlappyBird() {
        setPreferredSize(new Dimension(boardwidth, boardheight));
//        setBackground(Color.BLUE);
        setFocusable(true);
        addKeyListener(this);
//        load Images
        backgroundImg = new ImageIcon(getClass().getResource("./flappybirdbg.png")).getImage();
        birdImg=new ImageIcon(getClass().getResource("./flappybird.png")).getImage();
        topPeImg=new ImageIcon(getClass().getResource("./toppipe.png")).getImage();
        bottomPeImg=new ImageIcon(getClass().getResource("./bottompipe.png")).getImage();
//      bird
        bird=new Bird(birdImg);
        pipes = new ArrayList<Pipe>();

        //Place Pipes Timer
        placePipesTimer=new Timer(1500, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                placePipes();
            }
        });
        placePipesTimer.start();

        //game Timer
        gameLoop = new Timer(1000/60,this);
        gameLoop.start();

    }

    public void placePipes(){
        //pipeY = (0-1)*pipeHeight/2 ->(0-256)
        //pipeHeight/4= 128
        //Math.random*pipeHeight?2= 0-128-(0-256)-->3/4pipeheight
        int randomPipeY= (int) (pipeY-pipeHeight/4-Math.random()*(pipeHeight/2));
        int openingSpace=boardheight/4;

        Pipe topPipe=new Pipe(topPeImg);
        topPipe.y=randomPipeY;
        pipes.add(topPipe);

        Pipe bottomPipe=new Pipe(bottomPeImg);
        bottomPipe.y=topPipe.y+pipeHeight+openingSpace;
        pipes.add(bottomPipe);
    }

    public void paintComponent(Graphics g){
        super.paintComponent(g);
        draw(g);
    }
    public void draw(Graphics g){
        //background
        g.drawImage(backgroundImg,0,0,boardwidth,boardheight,null);

        //bird
        g.drawImage(bird.img,bird.x,bird.y,bird.width,bird.height,null);

        //Pipes
        for (int i=0;i< pipes.size();i++){
            Pipe pipe=pipes.get(i);
            g.drawImage(pipe.img, pipe.x,pipe.y,pipe.width,pipe.height,null);
        }

        //score
        g.setColor(Color.white);
        g.setFont(new Font("Arial",Font.PLAIN,32));
        if(gameOver){
            g.drawString("Game Over: "+String.valueOf((int)score),10,35);
        }else {
            g.drawString(String.valueOf((int)score),10,35);
        }
    }
    public void move(){
        //bird
        velocityY+=gravity;
        bird.y+=velocityY;
        bird.y=Math.max(bird.y,0);

        //pipes
        for (int i =0;i< pipes.size();i++){
            Pipe pipe=pipes.get(i);
            pipe.x+=velocityX;

            if(!pipe.passed && bird.x>pipe.x+pipe.width){
                pipe.passed=true;
                score+=0.5;
            }

            if (collision(bird,pipe)){
                gameOver=true;
            }
        }
        if(bird.y>boardheight){
            gameOver=true;
        }
    }
    public boolean collision(Bird a,Pipe b){
        return a.x < b.x+ b.width &&//a's top left corner doesnt reach b's top right corner
                a.x + a.width >b.x &&//a's top right corner doesnt reach b's left right corner
                a.y < b.y+b.height &&//a's top left corner doesnt reach b's bottom left corner
                a.y+a.height>b.y;//a's bottom left corner doesnt reach b's top left corner
    }
    @Override
    public void actionPerformed(ActionEvent e) {
        move();
        repaint();
        if(gameOver){
            placePipesTimer.stop();
            gameLoop.stop();
        }
    }


    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode()==KeyEvent.VK_SPACE){
            velocityY=-9;
            if(gameOver){
                //restart the game by resetting condition
                bird.y=birdY;
                velocityY=0;
                pipes.clear();;
                score=0;
                gameOver=false;
                gameLoop.start();
                placePipesTimer.start();
            }
        }

    }
    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }
}
