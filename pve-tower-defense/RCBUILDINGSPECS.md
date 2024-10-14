# Single Roller Coaster Building System Specification

## 1. Building Interface

### 1.1 Grid System
- Implement a 3D grid of tiles (e.g., 1x1x1 meter cubes)
- Allow vertical spacing in 0.5-meter increments for fine-tuning
- Highlight grid cells during construction for visual feedback

### 1.2 Toolbar Layout
- Create a horizontal toolbar at the bottom of the screen
- Implement expandable categories for better organization
- Categories:
    1. Track Pieces
    2. Coaster Elements
    3. Construction Tools
    4. Landscaping Tools

### 1.3 Toolbar Contents
1. Track Pieces:
    - Straight sections (various lengths)
    - Curves (left and right, different radii)
    - Slopes (upward and downward, various angles)
2. Coaster Elements:
    - Station platform
    - Chain lift
    - Brake run
    - Special elements (loops, corkscrews, helixes)
3. Construction Tools:
    - Selection tool
    - Elevation tool
    - Banking tool
    - Delete tool
4. Landscaping Tools:
    - Terrain raise/lower
    - Smoothing tool
    - Water tool

## 2. Track Construction Process

### 2.1 Starting Construction
- Place initial station platform
- Set default train configuration

### 2.2 Placing Track Pieces
- Implement a "ghost" preview of the track piece being placed
- Automatically connect to the previous piece
- Handle automatic orientation based on the previous piece
- Provide visual feedback for valid/invalid placements

### 2.3 Modifying Track
- Banking:
    - Implement a rotation gizmo for adjusting banking angle
    - Update track visuals in real-time
- Elevation changes:
    - Allow fine-tuning of track height in 0.5-meter increments
    - Automatically adjust connecting pieces
- Smoothing:
    - Implement a curve smoothing algorithm for more realistic transitions

### 2.4 Special Elements
- Loops:
    - Predefined loop pieces with customizable entry/exit heights
    - Automatic transition pieces for smooth integration
- Corkscrews:
    - Customizable corkscrew elements with adjustable rotation and length
- Helixes:
    - Allow customization of helix radius and number of rotations

### 2.5 Chain Lift Implementation
- Place chain lift segments on upward slopes
- Adjust cart physics for chain lift sections
- Implement chain lift sound effects

### 2.6 Deleting Track Sections
- Allow selection of track segments for deletion
- Automatically reconnect track if a middle section is removed
- Provide an "undo" feature for accidental deletions

### 2.7 Completing the Circuit
- Detect when the track forms a complete circuit
- Provide visual feedback for successful completion
- Allow for incomplete circuits (shuttle coasters)

## 3. Track Pieces

### 3.1 Straight Sections
- Lengths: 1m, 2m, 4m, 8m
- Customizable length option
- Geometry:
    - Use a simple rectangular prism for the track base
    - Dimensions: width 1m, height 0.2m, length as specified
    - Add two parallel cylinders on top for rails (radius 0.05m)
    - Include cross ties every 1m (thin rectangular prisms)
    - For realism, slightly taper the ends of the track piece for smoother connections

### 3.2 Curves
- Directions: Left, Right
- Radii: Tight (4m), Standard (8m), Wide (16m)
- Customizable radius option
- Geometry:
    - Use a curved rectangular prism for the track base
    - Arc angle: 45° for all curve pieces (adjust piece count for full turns)
    - Width and height same as straight sections
    - Add two parallel curved cylinders on top for rails
    - Include radial cross ties every 5° along the curve
    - Implement smooth transitions at curve ends for connection with straight pieces

### 3.3 Slopes
- Angles: 15°, 30°, 45°, 60°
- Upward and downward variations
- Customizable angle option
- Geometry:
    - Use a rectangular prism for the track base, rotated to the specified angle
    - Length: Adjust based on angle to maintain consistent ground-projection length
    - Add two parallel cylinders on top for rails, following the slope angle
    - Include cross ties perpendicular to the track direction
    - Implement smooth transitions at slope ends for connection with flat pieces

### 3.4 Special Elements

#### 3.4.1 Loops
- Standard vertical loop, customizable entry/exit heights
- Geometry:
    - Use a combination of curved segments to form a vertical circle
    - Typical diameter: 12m-15m (adjustable)
    - Gradually increase banking angle from 0° to 180° at the top, then back to 0°
    - Maintain consistent track width and rail placement throughout the loop
    - Add support structures: vertical beams connecting to the ground

#### 3.4.2 Corkscrews
- Adjustable rotation and length
- Geometry:
    - Use a helical curve for the track centerline
    - Typical length: 10m-20m
    - Rotate the track profile 360° around its central axis over the length
    - Maintain consistent track width and rail placement throughout
    - Add diagonal support beams connecting to the ground

#### 3.4.3 Helixes
- Customizable radius and number of rotations
- Geometry:
    - Use a helical curve with a vertical offset
    - Typical radius: 5m-10m
    - Height change: 2m-5m per rotation
    - Banking angle: Constant 45°-60° throughout the helix
    - Maintain consistent track width and rail placement
    - Add central support column and radial beams

#### 3.4.4 Inline Twists
- Adjustable length and rotation speed
- Geometry:
    - Use a straight line for the track centerline
    - Typical length: 5m-15m
    - Rotate the track profile 360° (or more) around the centerline
    - Maintain consistent track width and rail placement
    - Add support structures at the beginning and end of the element

### 3.5 Support Structures
- Automatically generate support structures for elevated track pieces
- Geometry:
    - Use vertical cylindrical beams (radius 0.2m-0.3m)
    - Add diagonal bracing for taller supports (height > 5m)
    - Implement footing plates at the base (square prisms)
    - Adjust support frequency based on track elevation and type

### 3.6 Connection Points
- Implement standardized connection points at the ends of each track piece
- Geometry:
    - Use small spheres or cubes to visualize connection points during construction
    - Ensure smooth transitions between different piece types (e.g., straight to curve)
    - Implement a snapping system for precise alignment during construction

## 4. Physics Simulation

### 4.1 Gravity and Momentum Calculations
- Implement realistic gravity simulation (9.8 m/s^2)
- Calculate momentum based on cart mass and velocity
- Account for track banking in force calculations

### 4.2 Speed Calculations
- Consider track layout, height differences, and friction
- Implement air resistance for more realistic top speeds
- Calculate potential and kinetic energy throughout the ride

### 4.3 G-force Calculations
- Compute lateral G-forces in curves and inversions
- Calculate vertical G-forces for hills and valleys
- Provide real-time G-force feedback during construction and testing

### 4.4 Real-time Feedback
- Display current speed, G-forces, and potential/kinetic energy
- Highlight track sections with excessive G-forces or potentially unsafe conditions
- Provide excitement and intensity ratings based on the layout

## 5. Cart System

### 5.1 Cart Creation and Attachment
- Define a single cart type for the coaster
- Allow basic customization of cart appearance (color)
- Implement a system for attaching carts to the track

### 5.2 Physics-based Movement
- Calculate cart position and orientation based on track geometry
- Apply forces (gravity, centripetal, friction) to determine acceleration
- Update cart velocity and position each frame

### 5.3 Multiple Cart Handling
- Allow configuration of train length (number of cars)
- Implement proper spacing between cars in a train
- Ensure smooth movement around curves and through inversions

### 5.4 Synchronization with Track Features
- Adjust cart speed on chain lifts
- Implement brake sections to reduce speed

### 5.5 Collision Detection
- Implement bounding volumes for carts and track elements
- Perform efficient collision checks between carts
- Detect and handle collisions with terrain or off-track situations

## 6. Integration with Existing Systems

### 6.1 CameraSystem Integration
- Implement a "ride camera" that follows a cart
- Allow smooth transitions between build and ride cameras
- Adjust camera behavior for different coaster elements (e.g., loops, corkscrews)

### 6.2 ActionsMenu Enhancement
- Add roller coaster specific actions to the context menu
- Include options for track modification and testing

### 6.3 Main Game Loop Updates
- Integrate physics calculations into the main game loop
- Implement efficient update cycles for carts and track pieces

## 7. User Interaction and Feedback

### 7.1 Construction Feedback
- Provide visual cues for valid and invalid track placements
- Implement a "helper" system to suggest track completions
- Display real-time statistics during construction (length, max speed, G-forces)

### 7.2 Testing Mode
- Allow users to send test trains
- Provide detailed analytics after test runs (speed graph, G-force map)
- Highlight potential issues or areas for improvement

## 8. Performance Considerations

### 8.1 Efficient Rendering
- Implement level of detail (LOD) for track pieces and terrain
- Use instancing for repeated elements (e.g., support structures, chain links)
- Optimize shader complexity for mobile devices

### 8.2 Physics Optimizations
- Implement spatial partitioning for collision detection
- Optimize calculations by pre-computing certain values for track segments

### 8.3 Memory Management
- Implement object pooling for frequently created/destroyed objects (e.g., particle effects)
- Use efficient data structures for storing and accessing track information