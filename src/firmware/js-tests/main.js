// FLIP fluid simulation code
import { Vec2 } from "./vec.js";

const gravity = new Vec2(0, -9.81)

let grid_size = 5;
let n_particles = 100;
let pic_cells = new Array(grid_size).fill(new Array(grid_size).fill(0));
// let i be y and j be x, or a[y][x] = a[i][j]

class FlipSimulation{
    constructor(n_particles, grid_size, cell_height){
        this.n_particles = n_particles;
        this.grid_size = grid_size;
        this.cell_height = cell_height; 
        this.particles = [];
        this.velocityfield = new VelocityField(grid_size, cell_height)
    }

    init(){
        // generate particles
        
    }


}

class VelocityField{
    /* Note that     | - - - |
    *  this is an    x       |
    *  offset grid   | - y - | in terms of velocity
    */
    constructor(size, height){
        this.size = size
        this.height = height
        this.velocity = this.generate_zero_vec_array(size)
        this.weights = this.generate_zero_array(size)
    }
    
    simulate(particles){
        let h = this.height
        // clear out arrays
        this.velocity = this.generate_zero_vec_array(this.size)
        this.weights = this.generate_zero_array(this.size)
        // [step 1] transfer particle velocity to grid 
        for (let i of particles){
            let x_cell = floor(abs(i.pos.x/h)); 
            let y_cell = floor(abs(i.pos.y/h)); 
            let dx = i.pos.x-x_cell * h
            let dy = i.pos.y-y_cell * h
            let w = [
                (1-dx/h)*(1-dy/h), 
                (dx/h)*(1-dy/h),
                (dx/h)*(dy/h), 
                (1-dx/h)*(dy/h)
            ]
            let neighbors = [
                {x: x_cell, y: y_cell},
                {x: x_cell+1, y:y_cell},
                {x: x_cell+1, y:y_cell+1},
                {x:x_cell, y: y_cell+1}
            ]
            for (let ix = 0; ix<4; ix++){
                let n = neighbors[ix]
                if (n.x >= 0 && n.x<= this.size && n.y>=0 && n.y<= this.size){
                    this.velocity[n.y][n.x].x += p.vel.x * w[ix];
                    this.velocity[n.y][n.x].y += p.vel.y * w[ix];
                    this.weights[n.y][n.x] += w[ix]
                }
            }
        }

        for (let i = 0; i<this.size; i++){
            for (let j = 0; i<this.size; j++){
                let total_w = this.weights[i][j]
                if (total_w >0){
                    this.velocity[i][j].x /= total_w;
                    this.velocity[i][j].y /= total_w;
                } 
            }
        }
    }

    generate_zero_vec_array(size){
        return new Array(size).fill(new Array(grid_size).fill(new Vec2(0, 0)))
    }

    generate_zero_array(size){
        return new Array(size).fill(new Array(grid_size).fill(0))
    }

    

    // particle_to_grid(particle, dx, dy){
    //     let h = this.height
    //     let w = [
    //         (1-dx/h)*(1-dy/h), 
    //         ()
    //     ]
    // }
}

class Particle{
    constructor(){
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
    }

    simulate(dt){
        this.vel = this.vel.add(gravity.scale(dt));
        this.pos = this.pos.add(this.vel.scale(dt));
        this.handle_boundary();
    }

    handle_boundary(){

    }
}